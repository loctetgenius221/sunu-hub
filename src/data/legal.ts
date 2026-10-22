// Pages d'information et pages légales.
// PROJETS DE TEXTE : à faire valider par un juriste avant toute ouverture publique (TDR §7, §10).
// Les informations inconnues sont signalées par TODO_ (affichées « à compléter » à l'écran).

export const LEGAL_UPDATED = '2026-10-19'

/** Valeur à compléter : affichée comme telle à l'écran, jamais inventée. */
export const TODO = (what: string) => `[${what} : à compléter]`

export type Block = string | { list: string[] } | { note: string }

export interface LegalSection {
  id: string
  title: string
  body: Block[]
}

export interface LegalPage {
  slug: string
  title: string
  description: string
  /** Ce qu'il faut retenir, en langage simple. */
  summary: string[]
  sections: LegalSection[]
}

const CONTACT = TODO('adresse e-mail de contact')
const DPO = TODO('adresse e-mail dédiée aux données personnelles')

export const legalPages: LegalPage[] = [
  {
    slug: 'mentions-legales',
    title: 'Mentions légales',
    description: 'Qui édite SUNU HŪB, qui l’héberge et comment nous joindre.',
    summary: [
      'SUNU HŪB est un projet porté par deux cofondateurs sénégalais, basé à Dakar.',
      'Le site est aujourd’hui une maquette : les offres, écoles et structures affichées sont fictives.',
    ],
    sections: [
      {
        id: 'editeur',
        title: 'Éditeur du site',
        body: [
          { list: [
            'Nom : SUNU HŪB',
            `Forme juridique : ${TODO('statut juridique')}`,
            `Immatriculation (RCCM) et NINEA : ${TODO('numéros')}`,
            `Siège : ${TODO('adresse')}, Dakar, Sénégal`,
            `Contact : ${CONTACT}`,
          ] },
          'Directrice de la publication : Fatimata Diallo, fondatrice.',
          'Responsable technique : Moussa Sagna, associé technique.',
        ],
      },
      {
        id: 'hebergement',
        title: 'Hébergement',
        body: [{ list: [`Hébergeur : ${TODO('nom de l’hébergeur')}`, `Adresse : ${TODO('adresse de l’hébergeur')}`] }],
      },
      {
        id: 'contenus',
        title: 'Contenus et propriété',
        body: [
          'La marque, le logo et les textes de SUNU HŪB appartiennent à leurs auteurs. Leur reproduction demande une autorisation écrite.',
          'Les opportunités reprises d’autres sites sont présentées par un titre, un résumé court et un lien vers l’annonce d’origine, jamais par leur texte complet. Une source peut demander le retrait de ses contenus : nous le faisons sous 48 heures.',
        ],
      },
      {
        id: 'maquette',
        title: 'Statut de la maquette',
        body: [
          'Cette version est une maquette de démonstration. Les opportunités, écoles, structures et candidats affichés sont fictifs. Aucune donnée saisie n’est envoyée à un serveur : elle reste dans le navigateur de l’appareil utilisé.',
        ],
      },
    ],
  },

  {
    slug: 'conditions-utilisation',
    title: 'Conditions d’utilisation',
    description: 'Les règles d’usage de SUNU HŪB, pour les jeunes comme pour les structures.',
    summary: [
      'SUNU HŪB est gratuit pour les jeunes, sans exception.',
      'Tu saisis toi-même tes vœux sur Campusen : personne ne le fait à ta place.',
      'Une offre qui demande de l’argent au candidat est refusée.',
      'Les recommandations aident à choisir ; elles ne garantissent ni une admission ni un emploi.',
    ],
    sections: [
      {
        id: 'objet',
        title: '1. Objet',
        body: [
          'SUNU HŪB est une plateforme intelligente qui aide les jeunes à s’orienter et à trouver des opportunités (stages, emplois juniors, bourses, concours, formations, financements). Elle permet aussi aux structures (écoles, universités, entreprises, ONG, incubateurs, institutions) de publier des opportunités.',
          'Utiliser SUNU HŪB vaut acceptation des présentes conditions.',
        ],
      },
      {
        id: 'compte',
        title: '2. Compte jeune',
        body: [
          'Le compte se crée avec un numéro de téléphone sénégalais et un code reçu par WhatsApp ou par SMS. Les informations du profil doivent être exactes.',
          'Une personne de moins de 18 ans doit avoir l’accord d’un parent ou d’un tuteur, recueilli à l’inscription.',
          'Le compte est personnel. Il peut être supprimé à tout moment depuis la page Profil, avec toutes ses données.',
        ],
      },
      {
        id: 'service',
        title: '3. Ce que fait le service',
        body: [
          { list: [
            'Proposer des opportunités et des formations triées selon le profil, avec la raison de leur classement.',
            'Indiquer le statut officiel des écoles et des formations, avec la source et la date de vérification.',
            'Envoyer des alertes et des rappels, dans la limite choisie (trois messages par semaine au plus par défaut).',
            'Aider à préparer une liste de vœux Campusen, sans jamais la déposer à la place du jeune.',
          ] },
        ],
      },
      {
        id: 'ia',
        title: '4. Recommandations et assistant',
        body: [
          'Les recommandations reposent sur des règles connues (filière, niveau, lieu, type recherché, disponibilité) et sur une base d’informations vérifiées. L’assistant répond uniquement à partir de cette base, cite sa source et dit « je ne sais pas » quand l’information manque.',
          'Les recommandations sont une aide à la décision. Elles ne garantissent ni une admission, ni un salaire, ni un emploi. Pour une décision importante, un conseiller d’orientation peut être sollicité gratuitement.',
          'Le classement ne dépend jamais d’un paiement (voir la charte de neutralité).',
        ],
      },
      {
        id: 'structures',
        title: '5. Compte structure',
        body: [
          'Une structure crée un compte avec un e-mail professionnel ou son NINEA. L’équipe SUNU HŪB vérifie chaque compte avant toute publication, sous 48 heures ouvrées.',
          'La structure s’engage à :',
          { list: [
            'publier uniquement des opportunités réelles, à jour et gratuites pour les candidats ;',
            'ne jamais demander d’argent à un candidat, sous aucune forme (frais de dossier, caution, formation payante imposée) ;',
            'ne contacter un jeune qu’avec son accord, et utiliser ses informations uniquement pour l’opportunité concernée ;',
            'indiquer aux candidats où en est leur candidature.',
          ] },
          'Chaque offre est relue avant sa mise en ligne. Une offre peut être refusée, masquée ou retirée, et un compte suspendu, en cas de manquement.',
        ],
      },
      {
        id: 'signalement',
        title: '6. Signalement et modération',
        body: [
          'Tout utilisateur peut signaler une offre suspecte depuis sa fiche. Après trois signalements, l’offre est masquée en attendant une vérification par l’équipe.',
          'Sont interdits : les fausses offres, les demandes de paiement, les contenus trompeurs, discriminatoires ou illégaux, et l’usage de la plateforme pour démarcher des jeunes sans leur accord.',
        ],
      },
      {
        id: 'campusen',
        title: '7. Campusen et dispositifs publics',
        body: [
          'SUNU HŪB est indépendant de Campusen, de l’ANAQ-Sup et de l’ANPEJ. Campusen reste le guichet officiel des vœux des bacheliers : le jeune y saisit lui-même sa liste. Les informations officielles reprises sont citées avec leur source.',
        ],
      },
      {
        id: 'responsabilite',
        title: '8. Responsabilité',
        body: [
          'SUNU HŪB vérifie les informations qu’il publie et indique leur date. Une information peut toutefois évoluer : coûts, dates et conditions doivent être confirmés auprès de l’établissement ou de la structure avant toute démarche.',
          'Le jeune candidate directement auprès de la structure. SUNU HŪB n’est pas partie au contrat de stage, de travail ou de formation qui peut en découler.',
        ],
      },
      {
        id: 'evolution',
        title: '9. Évolution des conditions',
        body: [
          'Les conditions peuvent évoluer, notamment à l’arrivée de services payants pour les structures. Toute modification importante est annoncée à l’avance. Les services restent gratuits pour les jeunes.',
          `Droit applicable : droit sénégalais. ${TODO('juridiction compétente')}.`,
        ],
      },
    ],
  },

  {
    slug: 'confidentialite',
    title: 'Politique de confidentialité',
    description: 'Les données que nous utilisons, pourquoi, combien de temps, et tes droits.',
    summary: [
      'Ton profil est privé par défaut.',
      'Aucune structure ne voit tes coordonnées sans ton accord.',
      'Tu peux exporter ou supprimer tes données à tout moment, depuis ton profil.',
      'Nous n’utilisons aucun cookie de publicité ni de suivi.',
    ],
    sections: [
      {
        id: 'responsable',
        title: '1. Responsable du traitement',
        body: [
          `SUNU HŪB, ${TODO('statut juridique et adresse')}. Contact pour les données personnelles : ${DPO}.`,
          'Les traitements respectent la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel. Les formalités auprès de la Commission de protection des données personnelles (CDP) seront accomplies avant l’ouverture publique.',
        ],
      },
      {
        id: 'donnees',
        title: '2. Données utilisées',
        body: [
          { list: [
            'Identification : numéro de téléphone, prénom, année de naissance.',
            'Accord parental pour les moins de 18 ans : nom et numéro du parent ou tuteur, date de l’accord.',
            'Parcours : stade, série ou année d’études, filière, ville, objectif, établissement, compétences, disponibilité.',
            'Orientation : réponses au questionnaire, pistes retenues, liste de vœux.',
            'Activité : offres sauvegardées, suivi de candidatures, avis donnés sur les offres, signalements.',
            'Préférences d’alertes : canal, types d’opportunités, fréquence.',
            'Structures : nom, type, ville, contact, e-mail professionnel ou NINEA, offres publiées.',
          ] },
          'Nous ne demandons ni pièce d’identité, ni données bancaires, ni données de santé.',
        ],
      },
      {
        id: 'finalites',
        title: '3. Pourquoi',
        body: [
          { list: [
            'Créer et sécuriser le compte.',
            'Proposer des opportunités et des pistes adaptées au profil, et expliquer leur classement.',
            'Envoyer les alertes et les rappels demandés.',
            'Transmettre une candidature ou une demande de contact, uniquement avec l’accord du jeune.',
            'Améliorer les recommandations à partir des avis donnés.',
            'Lutter contre les fausses offres.',
            'Produire des statistiques anonymes (par exemple, la demande par filière et par région), jamais par personne : aucune ligne ne porte sur moins de 20 jeunes.',
          ] },
        ],
      },
      {
        id: 'partage',
        title: '4. Qui y a accès',
        body: [
          'Le profil est privé. Une structure ne voit les informations d’un jeune que s’il candidate à son offre ou accepte sa demande de contact, et seulement ce qui est utile à cette opportunité.',
          'Nous ne vendons aucune donnée. Les prestataires techniques (hébergement, envoi des messages WhatsApp et SMS) n’y accèdent que pour rendre le service.',
          'Les moins de 18 ans ne reçoivent aucune prospection commerciale.',
        ],
      },
      {
        id: 'duree',
        title: '5. Combien de temps',
        body: [
          { list: [
            'Profil : tant que le compte est actif, puis suppression.',
            `Compte inactif : ${TODO('durée de conservation')}, après un message de rappel.`,
            'Accord parental : pendant la durée du compte, comme preuve du consentement.',
            'Signalements et décisions de modération : le temps nécessaire à la sécurité de la plateforme.',
          ] },
        ],
      },
      {
        id: 'droits',
        title: '6. Tes droits',
        body: [
          'Tu peux à tout moment consulter, corriger, exporter ou supprimer tes données, et retirer ton accord. L’export et la suppression se font directement depuis la page Profil, dans « Mes données ».',
          `Pour toute autre demande : ${DPO}. Tu peux aussi saisir la CDP.`,
        ],
      },
      {
        id: 'stockage',
        title: '7. Cookies et stockage sur l’appareil',
        body: [
          'SUNU HŪB n’utilise aucun cookie de publicité ni de mesure d’audience tierce.',
          'Dans cette maquette, le profil, les sauvegardes et les réponses sont enregistrés dans le stockage local du navigateur (localStorage), sur ton appareil uniquement. Ils servent à faire fonctionner le service et ne sont envoyés à personne. Effacer les données du site dans ton navigateur les supprime.',
          'Le site peut aussi garder une copie de ses pages sur l’appareil pour rester utilisable avec une connexion instable.',
        ],
      },
      {
        id: 'securite',
        title: '8. Sécurité',
        body: [
          'Les données de profil seront chiffrées et sauvegardées chaque jour sur le service final. L’accès des équipes est limité à ce qui est nécessaire à leur travail.',
        ],
      },
    ],
  },

  {
    slug: 'charte-neutralite',
    title: 'Charte de neutralité',
    description: 'Nos engagements pour un avis indépendant, écrits et publics.',
    summary: [
      'Personne ne peut payer pour être mieux classé.',
      'Tout contenu sponsorisé est étiqueté comme tel.',
      'Une offre qui demande de l’argent au candidat est refusée.',
    ],
    sections: [
      {
        id: 'regles',
        title: 'Nos cinq règles',
        body: [
          { list: [
            'Le classement des recommandations et des opportunités ne dépend jamais d’un paiement.',
            'Seuls les établissements habilités, et les formations accréditées ou reconnues CAMES, peuvent acheter une mise en avant.',
            'Tout contenu sponsorisé est étiqueté « sponsorisé ».',
            'Un jeune n’est contacté que s’il l’a demandé ou accepté.',
            'Toute offre qui demande de l’argent au candidat est refusée.',
          ] },
        ],
      },
      {
        id: 'equite',
        title: 'Équité entre les profils',
        body: [
          { list: [
            'Les opportunités sont classées par niveau (débutant, junior, confirmé), pour que chacun accède à des offres à sa portée.',
            'La motivation et les projets comptent, pas seulement le diplôme.',
            'Un même profil ne reçoit pas plus de trois demandes de contact par mois.',
            'Les recommandations d’orientation incluent deux pistes élargies, pour éviter les choix stéréotypés selon le genre ou la région.',
            'Le jeune peut toujours candidater lui-même, sans attendre d’être sélectionné.',
          ] },
        ],
      },
      {
        id: 'transparence',
        title: 'Transparence',
        body: [
          'Chaque recommandation indique pourquoi elle est proposée. Chaque statut d’école indique sa source et sa date. Les débouchés qui ne viennent d’aucune source officielle sont marqués « estimation ».',
          'Cette charte figure dans les conditions d’utilisation. Elle ne changera pas à l’arrivée des services payants pour les structures.',
        ],
      },
    ],
  },

  {
    slug: 'accessibilite',
    title: 'Accessibilité',
    description: 'Ce que nous faisons pour que SUNU HŪB soit utilisable par tous.',
    summary: [
      'Le site est pensé d’abord pour le téléphone, avec une connexion parfois instable.',
      'Les pages sont contrôlées avec un outil d’audit à chaque évolution importante.',
    ],
    sections: [
      {
        id: 'engagement',
        title: 'Notre engagement',
        body: [
          'SUNU HŪB vise le niveau AA des règles internationales d’accessibilité du web (WCAG 2.1).',
        ],
      },
      {
        id: 'fait',
        title: 'Ce qui est en place',
        body: [
          { list: [
            'Contrastes de texte vérifiés, d’au moins 4,5 pour 1.',
            'Navigation complète au clavier, avec un repère de focus visible.',
            'Lien « Aller au contenu » en début de page.',
            'Statuts toujours écrits, jamais indiqués par la seule couleur.',
            'Cibles tactiles d’au moins 44 pixels.',
            'Animations coupées quand le réglage « réduire les animations » est actif.',
            'Pages légères et consultables hors ligne après une première visite.',
          ] },
        ],
      },
      {
        id: 'limites',
        title: 'Limites connues',
        body: [
          'Le contenu est disponible en français uniquement ; des messages courts en wolof sont à l’étude. Un audit complet par un organisme indépendant reste à réaliser.',
        ],
      },
      {
        id: 'contact-a11y',
        title: 'Signaler un problème',
        body: [`Une page ou une fonction difficile à utiliser ? Écris-nous à ${CONTACT} : nous te répondons et cherchons une solution.`],
      },
    ],
  },
]

/** Aide : questions fréquentes, par thème. */
export const faq: { theme: string; items: { q: string; a: string }[] }[] = [
  {
    theme: 'Compte et profil',
    items: [
      { q: 'SUNU HŪB est-il vraiment gratuit ?', a: 'Oui, pour les jeunes, sans exception. Plus tard, certains services seront payants pour les structures, jamais pour toi.' },
      { q: 'Pourquoi mon numéro de téléphone ?', a: 'C’est ton identifiant : pas besoin d’e-mail ni de mot de passe. Il sert aussi aux alertes WhatsApp ou SMS, si tu les actives.' },
      { q: 'J’ai moins de 18 ans, puis-je m’inscrire ?', a: 'Oui, avec l’accord d’un parent ou d’un tuteur, demandé pendant l’inscription.' },
      { q: 'Comment supprimer mon compte ?', a: 'Depuis ton profil, dans « Mes données » : « Supprimer mon compte ». Tes données sont effacées.' },
    ],
  },
  {
    theme: 'Opportunités',
    items: [
      { q: 'Comment les offres sont-elles classées ?', a: 'Selon ta filière, ton niveau, le type d’opportunité que tu cherches, le lieu et la date limite. Chaque offre affiche la raison de sa place. Personne ne peut payer pour être mieux classé.' },
      { q: 'Que veut dire « Vérifiée » ou « Source externe » ?', a: '« Vérifiée » : notre équipe a contrôlé l’offre. « Source externe » : l’offre vient d’un autre site, avec le lien vers l’annonce d’origine.' },
      { q: 'On me demande de l’argent pour candidater. Que faire ?', a: 'Ne paie pas : c’est une arnaque. Signale l’offre depuis sa fiche, notre équipe la retire.' },
      { q: 'Comment recevoir un rappel avant la date limite ?', a: 'Sauvegarde l’offre : tu reçois un rappel 7 jours puis 1 jour avant.' },
    ],
  },
  {
    theme: 'Orientation et écoles',
    items: [
      { q: 'SUNU HŪB remplit-il ma liste Campusen à ma place ?', a: 'Non. Nous t’aidons à la préparer, mais tu la saisis toi-même sur Campusen. Personne ne doit le faire à ta place.' },
      { q: 'Comment savoir si une école est reconnue ?', a: 'Utilise « Vérifier une école » : tu vois si l’établissement est habilité et si ta formation est accréditée, avec la source et la date.' },
      { q: 'L’assistant peut-il se tromper ?', a: 'Il ne répond qu’à partir de notre base vérifiée et dit « je ne sais pas » quand l’information manque. Si une réponse te semble fausse, signale-la : elle est relue par l’équipe.' },
    ],
  },
  {
    theme: 'Structures',
    items: [
      { q: 'Combien coûte la publication d’une offre ?', a: 'Rien. La publication est gratuite dès le lancement.' },
      { q: 'Combien de temps pour valider mon compte ?', a: 'Sous 48 heures ouvrées. Chaque offre est ensuite relue avant sa mise en ligne, sous 24 heures.' },
    ],
  },
]

export const contact = { email: CONTACT, whatsapp: TODO('numéro WhatsApp'), city: 'Dakar, Sénégal' }
