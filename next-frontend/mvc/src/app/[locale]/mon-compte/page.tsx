import { cookies } from "next/headers";
import { CalendarDays, LogOut, Mail, PackageCheck, UserRound } from "lucide-react";
import Container from "@/components/layout/Container/Container";
import PageHeader from "@/components/blocks/PageHeader/PageHeader";
import { fetchWooAccount } from "@/integrations/woocommerce/accountApi";
import styles from "./page.module.css";

type AccountPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const cookieStore = await cookies();
  const params = (await searchParams) ?? {};
  const error = typeof params.erreur === "string" ? params.erreur : null;
  const connected = params.connexion === "ok";
  const account = await fetchWooAccount(cookieStore.toString());
  const checkoutHref = "/commande";

  return (
    <Container className={styles.container}>
      <PageHeader
        title="Espace client"
        intro="Retrouvez vos commandes et vos informations client dans un espace simple, relié directement à votre compte boutique."
      />

      {account.isLoggedIn ? (
        <section className={styles.dashboard} aria-label="Tableau de bord client">
          {connected ? (
            <p className={styles.success} role="status">
              Connexion réussie.
            </p>
          ) : null}

          <div className={styles.identity}>
            <span className={styles.identityIcon} aria-hidden="true">
              <UserRound />
            </span>
            <div>
              <p className={styles.kicker}>Compte connecté</p>
              <h2>{account.user.displayName}</h2>
              <p className={styles.email}>
                <Mail aria-hidden="true" />
                {account.user.email}
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <PackageCheck aria-hidden="true" />
                <h3>Commandes récentes</h3>
              </div>

              {account.recentOrders.length > 0 ? (
                <ul className={styles.orders}>
                  {account.recentOrders.map((order) => (
                    <li key={order.id} className={styles.order}>
                      <div>
                        <a href={order.viewUrl}>Commande n°{order.number}</a>
                        <p>
                          <CalendarDays aria-hidden="true" />
                          {order.date ?? "Date indisponible"}
                        </p>
                      </div>
                      <div className={styles.orderMeta}>
                        <span>{order.status}</span>
                        <strong
                          dangerouslySetInnerHTML={{ __html: order.totalHtml }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>
                  Aucune commande récente n’est encore associée à ce compte.
                </p>
              )}
            </section>

            <section className={styles.panel}>
              <h3>Accès rapides</h3>
              <div className={styles.actions}>
                <a href={account.links.orders}>Toutes mes commandes</a>
                <a href={account.links.addresses}>Mes adresses</a>
                <a href={account.links.details}>Mes informations</a>
                <a href={account.links.logout} className={styles.logout}>
                  <LogOut aria-hidden="true" />
                  Déconnexion
                </a>
              </div>
            </section>
          </div>
        </section>
      ) : (
        <section className={styles.loginLayout} aria-label="Connexion client">
          <form action="/api/account/login" method="post" className={styles.form}>
            <div>
              <p className={styles.kicker}>Connexion</p>
              <h2>Accéder à mon compte</h2>
            </div>

            {error ? (
              <p className={styles.error} role="alert">
                {error === "champs"
                  ? "Veuillez renseigner votre identifiant et votre mot de passe."
                  : "Identifiant ou mot de passe incorrect."}
              </p>
            ) : null}

            <label>
              Adresse e-mail ou identifiant
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Mot de passe
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            <label className={styles.remember}>
              <input name="remember" type="checkbox" value="1" />
              Rester connecté
            </label>

            <button type="submit">Se connecter</button>

            <div className={styles.secondaryLinks}>
              <a href="/wp-login.php?action=lostpassword">Mot de passe oublié</a>
              <a href={checkoutHref}>Créer un compte lors d’une commande</a>
            </div>
          </form>

          <aside className={styles.aside}>
            <h2>Un espace relié à la boutique</h2>
            <p>
              La connexion utilise le compte sécurisé WooCommerce, pendant que
              cette page reste intégrée au site pour une navigation plus fluide.
            </p>
          </aside>
        </section>
      )}
    </Container>
  );
}
