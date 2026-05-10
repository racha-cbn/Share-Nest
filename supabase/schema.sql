CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================================
--  SHARENEST — Script SQL complet pour Supabase (PostgreSQL)
--  Plateforme solidaire de dons et demandes de biens/services
-- ================================================================
--
--  CONTENU DU FICHIER :
--    1.  Tables sans clé étrangère  (categories, tags)
--    2.  Tables avec clé étrangère  (profiles, posts, transactions,
--                                    messages, reviews, notifications,
--                                    verification_docs)
--    3.  Tables associatives M-à-M  (post_tags, saved_posts)
--    4.  Indexes d'optimisation
--    5.  Requêtes ALTER
--    6.  DML — INSERT (seed data)
--    7.  DML — UPDATE
--    8.  DML — DELETE
--    9.  SELECT (avec jointures)
--   10.  GROUP BY + fonctions d'agrégation
--   11.  HAVING
--   12.  Row Level Security (Supabase RLS)
--   13.  Triggers (auto-profil + updated_at)
--
--  INSTRUCTIONS D'UTILISATION SUPABASE :
--    → Ouvrez votre projet Supabase
--    → Allez dans SQL Editor > New Query
--    → Collez ce script et cliquez Run
-- ================================================================


-- ================================================================
-- SECTION 1 : TABLE SANS CLÉ ÉTRANGÈRE — categories
-- ================================================================
-- Catégories des posts (meubles, vêtements, alimentation, etc.)
-- Aucune référence externe → table racine du schéma.

CREATE TABLE categories (
    category_id   SERIAL        PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL UNIQUE,
    description   TEXT,
    is_sensitive  BOOLEAN       NOT NULL DEFAULT FALSE,
    -- is_sensitive = TRUE → modération admin obligatoire (ex: médical)
    icon          VARCHAR(50),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- TABLE SANS CLÉ ÉTRANGÈRE — tags
-- ----------------------------------------------------------------
-- Mots-clés libres associés aux posts (ex: "urgent", "neuf", "Alger")

CREATE TABLE tags (
    tag_id      SERIAL       PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- ================================================================
-- SECTION 2 : TABLES AVEC CLÉ ÉTRANGÈRE
-- ================================================================

-- ----------------------------------------------------------------
-- profiles — Extension de auth.users (géré par Supabase Auth)
-- ----------------------------------------------------------------
-- Supabase crée auth.users automatiquement à l'inscription.
-- Cette table stocke les données métier complémentaires.

CREATE TABLE profiles (
    id               UUID          PRIMARY KEY
                                   REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name        VARCHAR(150)  NOT NULL,
    location         VARCHAR(200),
    phone            VARCHAR(20),
    avatar_url       TEXT,
    role             VARCHAR(20)   NOT NULL DEFAULT 'donor'
                                   CHECK (role IN ('donor','requester','admin')),
    reputation_score DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
    account_status   VARCHAR(20)   NOT NULL DEFAULT 'active'
                                   CHECK (account_status IN ('active','suspended','banned')),
    bio              TEXT,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- posts — Annonces de dons ou de demandes
-- ----------------------------------------------------------------

CREATE TABLE posts (
    post_id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID          NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    category_id     INT           NOT NULL REFERENCES categories(category_id),
    title           VARCHAR(200)  NOT NULL,
    description     TEXT          NOT NULL,
    post_type       VARCHAR(20)   NOT NULL
                                  CHECK (post_type IN ('donation','request')),
    location        VARCHAR(200),
    image_url       TEXT,
    delivery_option VARCHAR(20)   NOT NULL DEFAULT 'pickup'
                                  CHECK (delivery_option IN ('can_deliver','pickup','both')),
    status          VARCHAR(20)   NOT NULL DEFAULT 'available'
                                  CHECK (status IN ('available','reserved',
                                                    'completed','pending_review','archived')),
    urgency_level   VARCHAR(10)   NOT NULL DEFAULT 'low'
                                  CHECK (urgency_level IN ('low','medium','high')),
    is_anonymous    BOOLEAN       NOT NULL DEFAULT FALSE,
    view_count      INT           NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- transactions — Mise en relation donateur ↔ demandeur
-- ----------------------------------------------------------------

CREATE TABLE transactions (
    transaction_id  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID        NOT NULL REFERENCES posts(post_id),
    donor_id        UUID        NOT NULL REFERENCES profiles(id),
    requester_id    UUID        NOT NULL REFERENCES profiles(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'requested'
                                CHECK (status IN ('requested','accepted',
                                                  'completed','cancelled')),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- messages — Chat interne lié à une transaction
-- ----------------------------------------------------------------

CREATE TABLE messages (
    message_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID        NOT NULL
                                REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    sender_id       UUID        NOT NULL REFERENCES profiles(id),
    content         TEXT        NOT NULL,
    is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- reviews — Évaluations post-échange (1 à 5 étoiles)
-- ----------------------------------------------------------------

CREATE TABLE reviews (
    review_id       UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID  NOT NULL REFERENCES transactions(transaction_id),
    reviewer_id     UUID  NOT NULL REFERENCES profiles(id),
    rated_user_id   UUID  NOT NULL REFERENCES profiles(id),
    rating          INT   NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Un utilisateur ne peut laisser qu'un seul avis par transaction
    UNIQUE (transaction_id, reviewer_id)
);

-- ----------------------------------------------------------------
-- notifications — Alertes temps réel pour chaque utilisateur
-- ----------------------------------------------------------------

CREATE TABLE notifications (
    notification_id        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                UUID          NOT NULL
                                         REFERENCES profiles(id) ON DELETE CASCADE,
    type                   VARCHAR(50)   NOT NULL,
    -- Valeurs : 'new_request','match_accepted','message',
    --           'post_completed','system_alert'
    title                  VARCHAR(200)  NOT NULL,
    body                   TEXT,
    is_read                BOOLEAN       NOT NULL DEFAULT FALSE,
    related_post_id        UUID          REFERENCES posts(post_id) ON DELETE SET NULL,
    related_transaction_id UUID          REFERENCES transactions(transaction_id)
                                         ON DELETE SET NULL,
    created_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- verification_docs — Documents justificatifs (cas sensibles)
-- ----------------------------------------------------------------

CREATE TABLE verification_docs (
    doc_id       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID         NOT NULL
                              REFERENCES profiles(id) ON DELETE CASCADE,
    doc_path     TEXT         NOT NULL,   -- chemin sécurisé dans Supabase Storage
    doc_type     VARCHAR(50),             -- 'id_card','proof_of_need','prescription'
    status       VARCHAR(20)  NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','approved','rejected')),
    admin_notes  TEXT,
    reviewed_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- ================================================================
-- SECTION 3 : TABLES ASSOCIATIVES (Plusieurs-à-Plusieurs)
-- ================================================================

-- ----------------------------------------------------------------
-- post_tags — Un post peut avoir plusieurs tags, un tag → plusieurs posts
-- ----------------------------------------------------------------

CREATE TABLE post_tags (
    post_id  UUID  NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    tag_id   INT   NOT NULL REFERENCES tags(tag_id)   ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- ----------------------------------------------------------------
-- saved_posts — Un utilisateur sauvegarde plusieurs posts (favoris)
-- ----------------------------------------------------------------

CREATE TABLE saved_posts (
    user_id   UUID        NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
    post_id   UUID        NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    saved_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);


-- ================================================================
-- SECTION 4 : INDEXES D'OPTIMISATION
-- ================================================================

CREATE INDEX idx_posts_category    ON posts(category_id);
CREATE INDEX idx_posts_type        ON posts(post_type);
CREATE INDEX idx_posts_status      ON posts(status);
CREATE INDEX idx_posts_location    ON posts(location);
CREATE INDEX idx_posts_user        ON posts(user_id);
CREATE INDEX idx_posts_urgency     ON posts(urgency_level);
CREATE INDEX idx_trans_donor       ON transactions(donor_id);
CREATE INDEX idx_trans_requester   ON transactions(requester_id);
CREATE INDEX idx_trans_post        ON transactions(post_id);
CREATE INDEX idx_msg_transaction   ON messages(transaction_id);
CREATE INDEX idx_notif_user        ON notifications(user_id);
CREATE INDEX idx_notif_is_read     ON notifications(user_id, is_read);


-- ================================================================
-- SECTION 5 : REQUÊTE ALTER — Modification de la structure
-- ================================================================

-- 5.1 Ajouter la colonne "wilaya" pour le filtrage géographique algérien
ALTER TABLE posts
    ADD COLUMN wilaya VARCHAR(50);

-- 5.2 Ajouter la date de dernière connexion dans profiles
ALTER TABLE profiles
    ADD COLUMN last_login TIMESTAMPTZ;

-- 5.3 Ajouter une contrainte CHECK sur reputation_score (0.00 → 5.00)
ALTER TABLE profiles
    ADD CONSTRAINT chk_reputation_range
    CHECK (reputation_score >= 0.00 AND reputation_score <= 5.00);

-- 5.4 Ajouter une colonne quota_this_month dans profiles (anti-abus)
ALTER TABLE profiles
    ADD COLUMN quota_reset_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- 5.5 Renommer la colonne image_url en media_url pour plus de généralité
ALTER TABLE posts
    RENAME COLUMN image_url TO media_url;


-- ================================================================
-- SECTION 6 : DML — INSERT (Données initiales / Seed)
-- ================================================================

-- ----------------------------------------------------------------
-- 6.1 Insertion des catégories
-- ----------------------------------------------------------------

INSERT INTO categories (name, description, is_sensitive, icon) VALUES
  ('Meubles',          'Tables, chaises, armoires, canapés, lits...',          FALSE, 'sofa'),
  ('Vêtements',        'Habits adultes, enfants, chaussures, accessoires',     FALSE, 'shirt'),
  ('Alimentation',     'Nourriture non-périmée, conserves, produits secs',     TRUE,  'food'),
  ('Électronique',     'Téléphones, ordinateurs, téléviseurs, appareils',      FALSE, 'laptop'),
  ('Livres & Études',  'Manuels scolaires, romans, encyclopédies',             FALSE, 'book'),
  ('Équipements',      'Outils de bricolage, matériel de jardinage',           FALSE, 'tool'),
  ('Services',         'Aide au déménagement, cours particuliers, jardinage',  FALSE, 'handshake'),
  ('Médical',          'Fauteuils roulants, béquilles, médicaments, lunettes', TRUE,  'medical'),
  ('Jouets & Enfants', 'Jouets, poussettes, vêtements bébé, puériculture',    FALSE, 'toy'),
  ('Divers',           'Autres objets non classés dans les catégories',        FALSE, 'misc');

-- ----------------------------------------------------------------
-- 6.2 Insertion des tags
-- ----------------------------------------------------------------

INSERT INTO tags (name) VALUES
  ('urgent'),
  ('gratuit'),
  ('bon état'),
  ('neuf'),
  ('à emporter'),
  ('livraison possible'),
  ('Alger'),
  ('Oran'),
  ('Constantine'),
  ('Annaba'),
  ('Tizi Ouzou'),
  ('Batna');


-- ================================================================
-- SECTION 7 : DML — UPDATE
-- ================================================================

-- 7.1 Mettre un post en statut "reserved" après acceptation d'une demande
UPDATE posts
SET
    status     = 'reserved',
    updated_at = NOW()
WHERE
    title  = 'Canapé 3 places en bon état'
    AND status = 'available';

-- 7.2 Recalculer automatiquement le score de réputation d'un utilisateur
--     après ajout d'un nouvel avis (moyenne de toutes ses notes)
UPDATE profiles
SET
    reputation_score = ROUND((
        SELECT AVG(rating)::NUMERIC
        FROM reviews
        WHERE rated_user_id = profiles.id
    ), 2),
    updated_at = NOW()
WHERE
    id IN (SELECT DISTINCT rated_user_id FROM reviews);

-- 7.3 Marquer toutes les notifications comme lues pour un utilisateur
--     (ex: l'utilisateur clique "Tout marquer comme lu")
UPDATE notifications
SET is_read = TRUE
WHERE
    user_id = (
        SELECT id FROM profiles WHERE full_name = 'Amira Benali' LIMIT 1
    )
    AND is_read = FALSE;

-- 7.4 Suspendre un compte signalé (action admin)
UPDATE profiles
SET
    account_status = 'suspended',
    updated_at     = NOW()
WHERE
    id = (
        SELECT id FROM profiles WHERE full_name = 'Utilisateur Suspendu' LIMIT 1
    );


-- ================================================================
-- SECTION 8 : DML — DELETE
-- ================================================================

-- 8.1 Supprimer les notifications lues datant de plus de 30 jours
DELETE FROM notifications
WHERE
    is_read    = TRUE
    AND created_at < NOW() - INTERVAL '30 days';

-- 8.2 Supprimer les messages d'une transaction annulée
DELETE FROM messages
WHERE
    transaction_id IN (
        SELECT transaction_id
        FROM transactions
        WHERE status = 'cancelled'
          AND updated_at < NOW() - INTERVAL '90 days'
    );

-- 8.3 Archiver (soft delete) les posts inactifs depuis plus de 6 mois
--     → On préfère UPDATE à DELETE pour garder l'historique (audit trail)
UPDATE posts
SET
    status     = 'archived',
    updated_at = NOW()
WHERE
    status     = 'available'
    AND created_at < NOW() - INTERVAL '6 months';

-- 8.4 Supprimer un tag orphelin (sans aucun post associé)
DELETE FROM tags
WHERE
    tag_id NOT IN (SELECT DISTINCT tag_id FROM post_tags);


-- ================================================================
-- SECTION 9 : SELECT — Requêtes de lecture avec jointures
-- ================================================================

-- 9.1 Feed principal : tous les posts disponibles avec infos enrichies
SELECT
    p.post_id,
    p.title,
    p.description,
    p.post_type,
    p.location,
    p.wilaya,
    p.status,
    p.urgency_level,
    p.delivery_option,
    p.created_at,
    c.name         AS category_name,
    c.icon         AS category_icon,
    c.is_sensitive,
    -- Masquer l'identité si le post est anonyme
    CASE WHEN p.is_anonymous THEN 'Anonyme'
         ELSE pr.full_name
    END            AS poster_name,
    CASE WHEN p.is_anonymous THEN NULL
         ELSE pr.avatar_url
    END            AS poster_avatar,
    pr.reputation_score,
    pr.location    AS poster_location
FROM
    posts p
    JOIN categories c  ON p.category_id  = c.category_id
    JOIN profiles   pr ON p.user_id      = pr.id
WHERE
    p.status           = 'available'
    AND pr.account_status = 'active'
ORDER BY
    -- Priorité : urgence haute → date décroissante
    CASE p.urgency_level
        WHEN 'high'   THEN 1
        WHEN 'medium' THEN 2
        ELSE               3
    END ASC,
    p.created_at DESC;


-- ================================================================
-- SECTION 10 : GROUP BY + fonctions d'agrégation
-- ================================================================

-- Statistiques complètes des posts par catégorie
SELECT
    c.category_id,
    c.name                                                AS categorie,
    COUNT(p.post_id)                                      AS total_posts,
    COUNT(CASE WHEN p.post_type = 'donation'   THEN 1 END) AS total_dons,
    COUNT(CASE WHEN p.post_type = 'request'    THEN 1 END) AS total_demandes,
    COUNT(CASE WHEN p.status    = 'available'  THEN 1 END) AS disponibles,
    COUNT(CASE WHEN p.status    = 'reserved'   THEN 1 END) AS reserves,
    COUNT(CASE WHEN p.status    = 'completed'  THEN 1 END) AS completes,
    ROUND(
        AVG(CASE WHEN p.status = 'completed' THEN 1.0 ELSE 0.0 END) * 100,
        1
    )                                                     AS taux_completion_pct,
    SUM(p.view_count)                                     AS total_vues,
    MAX(p.created_at)                                     AS dernier_post
FROM
    categories c
    LEFT JOIN posts p ON c.category_id = p.category_id
                     AND p.status != 'archived'
GROUP BY
    c.category_id, c.name
ORDER BY
    total_posts DESC,
    taux_completion_pct DESC;


-- ================================================================
-- SECTION 11 : HAVING — Filtre sur une agrégation
-- ================================================================

-- 11.1 Utilisateurs les plus actifs ayant au moins 3 posts non-archivés
SELECT
    pr.id,
    CASE WHEN BOOL_OR(p.is_anonymous) THEN 'Anonyme'
         ELSE MAX(pr.full_name)
    END                                                AS utilisateur,
    MAX(pr.location)                                   AS localisation,
    COUNT(p.post_id)                                   AS total_posts,
    COUNT(CASE WHEN p.post_type = 'donation'  THEN 1 END) AS dons,
    COUNT(CASE WHEN p.post_type = 'request'   THEN 1 END) AS demandes,
    COUNT(CASE WHEN p.status    = 'completed' THEN 1 END) AS echanges_reussis,
    ROUND(AVG(r.rating)::NUMERIC, 2)                   AS note_moyenne,
    COUNT(DISTINCT r.review_id)                        AS nb_avis_recus
FROM
    profiles pr
    LEFT JOIN posts   p ON pr.id = p.user_id
                       AND p.status != 'archived'
    LEFT JOIN reviews r ON pr.id = r.rated_user_id
WHERE
    pr.account_status = 'active'
GROUP BY
    pr.id
HAVING
    COUNT(p.post_id) >= 3          -- seuil d'activité minimale
ORDER BY
    total_posts   DESC,
    note_moyenne  DESC NULLS LAST;


-- 11.2 Catégories avec un fort taux d'achèvement (> 50%)
SELECT
    c.name                                               AS categorie,
    COUNT(p.post_id)                                     AS total_posts,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END)   AS completes,
    ROUND(
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END)::NUMERIC
        / NULLIF(COUNT(p.post_id), 0) * 100,
        1
    )                                                    AS taux_completion_pct,
    AVG(
        EXTRACT(EPOCH FROM (p.updated_at - p.created_at)) / 3600
    )::INT                                               AS duree_moy_heures
FROM
    categories c
    JOIN posts p ON c.category_id = p.category_id
GROUP BY
    c.category_id, c.name
HAVING
    ROUND(
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END)::NUMERIC
        / NULLIF(COUNT(p.post_id), 0) * 100,
        1
    ) > 50
ORDER BY
    taux_completion_pct DESC;


-- ================================================================
-- SECTION 12 : ROW LEVEL SECURITY (Supabase RLS)
-- ================================================================
-- RLS garantit que chaque utilisateur ne voit que ses propres données
-- sensibles, même si quelqu'un accède directement à l'API Supabase.

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_docs ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
CREATE POLICY "Profils visibles par tous"
    ON profiles FOR SELECT USING (TRUE);

CREATE POLICY "Utilisateur modifie son propre profil"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- ---- posts ----
CREATE POLICY "Posts visibles par tous"
    ON posts FOR SELECT USING (TRUE);

CREATE POLICY "Utilisateur crée un post"
    ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateur modifie son post"
    ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilisateur supprime son post"
    ON posts FOR DELETE USING (auth.uid() = user_id);

-- ---- transactions ----
CREATE POLICY "Transaction visible par les deux participants"
    ON transactions FOR SELECT
    USING (auth.uid() = donor_id OR auth.uid() = requester_id);

CREATE POLICY "Requester crée une transaction"
    ON transactions FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- ---- messages ----
CREATE POLICY "Messages visibles par les participants"
    ON messages FOR SELECT
    USING (
        auth.uid() IN (
            SELECT donor_id     FROM transactions
            WHERE transaction_id = messages.transaction_id
            UNION
            SELECT requester_id FROM transactions
            WHERE transaction_id = messages.transaction_id
        )
    );

CREATE POLICY "Expéditeur envoie un message"
    ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ---- notifications ----
CREATE POLICY "Notifications personnelles uniquement"
    ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Marquer notification comme lue"
    ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ---- saved_posts ----
CREATE POLICY "Favoris personnels"
    ON saved_posts FOR SELECT  USING (auth.uid() = user_id);

CREATE POLICY "Ajouter un favori"
    ON saved_posts FOR INSERT  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Supprimer un favori"
    ON saved_posts FOR DELETE  USING (auth.uid() = user_id);

-- ---- verification_docs ----
CREATE POLICY "Docs visibles par le propriétaire"
    ON verification_docs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Uploader un document"
    ON verification_docs FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ================================================================
-- SECTION 13 : TRIGGERS
-- ================================================================

-- ----------------------------------------------------------------
-- 13.1 Trigger : Créer un profil automatiquement à l'inscription
-- ----------------------------------------------------------------
-- Quand Supabase Auth crée un nouvel utilisateur, ce trigger
-- insère automatiquement une ligne dans "profiles".

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'donor')
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------
-- 13.2 Trigger : Mettre à jour "updated_at" automatiquement
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------
-- 13.3 Trigger : Mettre à jour le score de réputation après un avis
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_reputation_after_review()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE profiles
    SET
        reputation_score = ROUND((
            SELECT AVG(rating)::NUMERIC
            FROM reviews
            WHERE rated_user_id = NEW.rated_user_id
        ), 2),
        updated_at = NOW()
    WHERE id = NEW.rated_user_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_reputation
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_reputation_after_review();


-- ================================================================
-- FIN DU SCRIPT SHARENEST
-- ================================================================
-- Récapitulatif des exigences couvertes :
--  ✅ Table sans clé étrangère     → categories, tags
--  ✅ Table avec clé étrangère     → profiles, posts, transactions,
--                                    messages, reviews, notifications,
--                                    verification_docs
--  ✅ Table associative M-à-M      → post_tags, saved_posts
--  ✅ Requête ALTER                → Section 5 (5 opérations)
--  ✅ INSERT                       → Section 6
--  ✅ UPDATE                       → Section 7
--  ✅ DELETE                       → Section 8
--  ✅ SELECT avec jointures        → Section 9
--  ✅ GROUP BY + AVG/COUNT/SUM/MAX → Section 10
--  ✅ HAVING                       → Section 11
-- ================================================================
