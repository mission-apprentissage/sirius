import { Link } from "react-router-dom";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Container } from "./shared.style";

const MentionsInformationBackOfficePage = () => {
  return (
    <Container>
      <h1>Mentions d'information</h1>
      <h3>Traitement de données à caractère personnel</h3>
      <p>
        Sirius est développé au sein de la Mission InserJeunes et permet via un questionnaire de
        recueillir les témoignages et retours d’expérience d’apprentis et de les exposer aux
        collégiens pour les aider dans leurs choix d’orientation.
      </p>
      <p>
        Le responsable de traitement est la Délégation générale à l’emploi et à la formation
        professionnelle, représentée par Monsieur Bruno Lucas. Le service numérique est en cours de
        transfert vers l’ONISEP.
      </p>
      <h3>Finalités</h3>
      <p>
        Sirius peut collecter des données à caractère personnel pour permettre aux agents de créer
        des questionnaires permettant de recueillir les témoignages et retours d’expérience
        d’apprentis et de jeunes.
      </p>
      <h3>Données personnelles traitées</h3>
      <p>
        Pour vous permettre de créer un compte de gestion lié à votre CFA, nous traitons les données
        suivantes relatives aux agents : nom, prénom, adresse e-mail.
      </p>
      <p>
        <b>
          Nous rappelons que les données contenues dans les formulaires ne sont pas rattachées à des
          individus mais à des formations CFA.
        </b>
      </p>
      <h3>Base juridique du traitements de données</h3>
      <p>
        Les données traitées par le site sont fondées sur l’exécution d’une mission d’intérêt public
        ou relevant de l’exercice de l’autorité publique dont est investi le responsable de
        traitement au sens de l’article 6-e du RPGD.
      </p>
      <p>
        Cette mission d’intérêt public est notamment précisée à l’article D.313-14 du code de
        l’éducation qui prévoit notamment que l’ONISEP est chargée{" "}
        <i>
          “de contribuer aux études et recherches relatives aux méthodes et aux moyens propres à
          faciliter l'information et l'accompagnement à l'orientation tout au long de la vie ; de
          contribuer aux études et recherches tendant à améliorer la connaissance des activités
          professionnelles et de leur évolution” et plus généralement d'apporter “sa collaboration
          aux administrations et aux organismes intéressés par les questions qui relèvent de sa
          compétence, [...] en vue de l'élaboration et de la mise en oeuvre de la politique
          coordonnée de formation professionnelle et de promotion sociale”
        </i>
        .
      </p>
      <h3>Durée de conservation</h3>
      <p>
        Les données à caractère personnel sont conservées pour une durée de 2 mois à compter du
        départ (connu par l’ONISEP) de l’agent ou au plus tard après 2 ans d’inactivité de compte
        d’un agent.
      </p>
      <h3>Droit des personnes concernées</h3>
      <p>Vous disposez des droits suivants concernant vos données à caractère personnel :</p>
      <ul>
        <li>Droit d’information et droit d’accès aux données ;</li>
        <li>Droit de rectification des données ;</li>
        <li>Droit à la limitation des données.</li>
      </ul>
      <p>
        Pour les exercer, faites-nous parvenir une demande en précisant la date et l’heure précise
        de la requête – ces éléments sont indispensables pour nous permettre de retrouver votre
        recherche – :
      </p>
      <ul>
        <li>
          Par courriel :{" "}
          <Link isExternal href="mailto:dpo@onisep.fr">
            dpo@onisep.fr
          </Link>
        </li>
        <li>
          Ou par courrier postal : ONISEP , A l’attention du Délégué à la Protection des Données, 12
          mail Barthélémy Thimonnier, CS10450 Lognes, 77437 Marne-la-Vallée cedex 2
        </li>
      </ul>
      <p>
        En raison de l'obligation de sécurité et de confidentialité dans le traitement des données à
        caractère personnel qui incombe au responsable de traitement, les demandes des personnes
        concernées ne seront traitées que si nous sommes en mesure de vous identifier de façon
        certaine.
      </p>
      <p>
        En cas de doute sérieux sur votre identité, nous pouvons être amenés à vous demander la
        communication d’une preuve d’identité.
      </p>
      <p>
        Pour vous aider dans votre démarche, vous trouverez
        <Link isExternal href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces">
          ici
        </Link>{" "}
        un modèle de courrier élaboré par la CNIL.
      </p>
      <p>
        Le responsable de traitement s’engage à répondre dans un délai raisonnable qui ne saurait
        dépasser 1 mois à compter de la réception de votre demande.
      </p>
      <h3>Destinataires des données</h3>
      <p>
        Seules les personnes strictement habilitées ont accès aux données à l’ONISEP et à la DGEFP.
      </p>
      <h3>Sécurité et confidentialité des données</h3>
      <p>
        Les mesures techniques et organisationnelles de sécurité adoptées pour assurer la
        confidentialité, l’intégrité et protéger l’accès des données sont notamment :
      </p>
      <ul>
        <li>Stockage des données en base de données</li>
        <li>Stockage des mots de passe en base sont hachés</li>
        <li>Mesures de traçabilité</li>
        <li>Surveillance</li>
        <li>Protection contre les virus, malwares et logiciels espions</li>
        <li>Protection des réseaux</li>
        <li>Sauvegarde</li>
        <li>Mesures restrictives limitant l’accès physiques aux données à caractère personnel</li>
      </ul>
      <h3>Sous-traitants</h3>
      <p>
        Certaines des données sont envoyées à des sous-traitants pour réaliser certaines missions.
        Le responsable de traitement s'est assuré de la mise en œuvre par ses sous-traitants de
        garanties adéquates et du respect de conditions strictes de confidentialité, d’usage et de
        protection des données.
      </p>
      <Table
        headers={["Sous-traitant", "Pays destinataire", "Traitement réalisé", "Garanties"]}
        data={[
          [
            "OVH",
            "France",
            "Hébergement",
            <Link
              key={0}
              target="_blank"
              href="https://www.ovhcloud.com/fr/personal-data-protection/"
            >
              https://www.ovhcloud.com/fr/personal-data-protection/
            </Link>,
          ],
          [
            "Onisep",
            "France",
            "ST DGEFP",
            <Link key={1} target="_blank" href="https://www.onisep.fr/donnees-personnelles">
              https://www.onisep.fr/donnees-personnelles
            </Link>,
          ],
        ]}
      />
      <h3>Cookies</h3>
      <p>
        En application de l’article 5(3) de la directive 2002/58/CE modifiée concernant le
        traitement des données à caractère personnel et la protection de la vie privée dans le
        secteur des communications électroniques, transposée à l’article 82 de la loi n°78-17 du 6
        janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs ou
        cookies suivent deux régimes distincts.
      </p>
      <p>
        Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de faciliter
        la communication par voie électronique sont dispensés de consentement préalable au titre de
        l’article 82 de la loi n°78-17 du 6 janvier 1978.
      </p>
      <p>
        Les cookies n’étant pas strictement nécessaires au service ou n’ayant pas pour finalité
        exclusive de faciliter la communication par voie électronique doivent être consenti par
        l’utilisateur.
      </p>
      <p>
        Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques
        constitue une base légale au sens du RGPD et doit être entendu au sens de l'article 6-a du
        Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la
        protection des personnes physiques à l'égard du traitement des données à caractère personnel
        et à la libre circulation de ces données.
      </p>
      <p>
        <b>Sirius ne dépose pas de cookies</b>
      </p>
    </Container>
  );
};

export default MentionsInformationBackOfficePage;
