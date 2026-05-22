import Hero from "@/components/blocks/Hero/Hero";
import Section from "@/components/layout/Section/Section";
import Container from "@/components/layout/Container/Container";
import GuideContent from "@/components/guide/GuideContent/GuideContent";
import TextBlock from "@/components/blocks/TextBlock/TextBlock";

export default function CommentChoisirSesCordesPage() {
  return (
    <>
      <Hero
        title="Comment choisir ses cordes ?"
        subtitle="Comprendre les grands équilibres avant de comparer les modèles."
        variant="page"
      />

      <Section>
        <Container>
          <GuideContent>
            <p>
              Choisir des cordes n’est pas seulement une question de marque ou de prix.
              Les cordes influencent directement la couleur du son, la réponse de l’instrument,
              le confort de jeu et la projection.
            </p>

            <p>
              Pourtant, il n’existe pas une “meilleure” corde universelle.
              Une corde très appréciée sur un violon peut devenir décevante sur un autre.
              Le bon choix dépend surtout d’un équilibre entre votre instrument,
              votre manière de jouer et le son que vous recherchez.
            </p>

            <h2>Commencer par écouter son violon</h2>

            <p>
              Avant de regarder les références ou les gammes, il faut essayer de comprendre
              le caractère naturel de l’instrument.
            </p>

            <p>
              Certains violons sont naturellement brillants, directs ou très projectifs.
              D’autres sont plus ronds, plus sombres ou plus denses.
              Les cordes peuvent renforcer ces caractéristiques, ou au contraire les équilibrer.
            </p>

            <p>
              L’objectif n’est pas forcément de transformer complètement un violon,
              mais souvent de révéler ce qu’il fait déjà bien.
            </p>

            <h2>Le son recherché</h2>

            <p>
              Beaucoup de choix de cordes tournent autour de trois grandes recherches sonores :
              chaleur, brillance ou équilibre.
            </p>

            <h3>Un son chaud</h3>

            <p>
              Un son chaud donne une impression de rondeur, de densité et de douceur.
              Les aigus sont généralement moins agressifs et les graves plus présents.
            </p>

            <p>
              Ce type de recherche est fréquent sur des instruments très brillants,
              ou chez des musiciens qui privilégient la richesse du timbre.
            </p>

            <h3>Un son brillant</h3>

            <p>
              Un son brillant apporte davantage de clarté, d’attaque et de projection.
              Le violon ressort plus facilement dans une salle ou dans un ensemble.
            </p>

            <p>
              Cela peut être utile pour réveiller un instrument un peu sombre
              ou gagner en présence dans le jeu orchestral et soliste.
            </p>

            <h3>Un son équilibré</h3>

            <p>
              Beaucoup de musiciens recherchent finalement un équilibre :
              suffisamment de chaleur pour garder de la matière,
              mais assez de clarté pour conserver de la précision et de la projection.
            </p>

            <h2>Le niveau et l’usage comptent aussi</h2>

            <p>
              Un étudiant ne recherche pas toujours les mêmes qualités
              qu’un musicien avancé ou un professionnel.
            </p>

            <p>
              Certaines cordes privilégient avant tout la stabilité,
              la facilité d’émission et la durée de vie.
              D’autres cherchent davantage de nuances,
              de rapidité de réponse ou de complexité sonore.
            </p>

            <p>
              Le contexte de jeu compte également :
              travail quotidien, orchestre, musique de chambre,
              scène amplifiée ou jeu soliste ne demandent pas toujours les mêmes équilibres.
            </p>

            <h2>Éviter les choix trop radicaux</h2>

            <p>
              Changer complètement la personnalité d’un instrument par les cordes fonctionne rarement.
              Les meilleurs résultats viennent souvent d’ajustements progressifs et cohérents.
            </p>

            <p>
              Il est aussi fréquent de mélanger plusieurs références :
              par exemple une corde de mi plus brillante avec un reste de jeu plus chaleureux,
              ou inversement.
            </p>

            <h2>Choisir plus simplement</h2>

            <p>
              Pour simplifier le choix, le plus utile est souvent de partir de quelques questions simples :
            </p>

            <ul>
              <li>Mon violon manque-t-il de chaleur ou de clarté ?</li>
              <li>Est-ce que je cherche davantage de projection ou de confort ?</li>
              <li>Quel est mon niveau et mon usage principal ?</li>
              <li>Est-ce que je veux corriger un problème ou affiner une couleur ?</li>
            </ul>

            <p>
              À partir de là, il devient beaucoup plus facile de s’orienter vers une famille de cordes cohérente.
            </p>
          </GuideContent>
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <TextBlock
            title="Aller plus loin"
            text="Vous pouvez ensuite explorer les guides par profil sonore, type de violon, niveau de jeu ou budget pour affiner votre choix plus précisément."
            actions={[
              {
                label: "Voir les cordes violon",
                href: "/fr/cordes/violon",
              },
              {
                label: "Explorer les sélections",
                href: "/fr/selections",
              },
            ]}
          />
        </Container>
      </Section>
    </>
  );
}