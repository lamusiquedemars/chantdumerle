const endpoint = process.env.WP_GRAPHQL_URL;
const WORDPRESS_FETCH_TIMEOUT_MS = 25000;

export const hasWordPressEndpoint = Boolean(endpoint);

/* → simple
→ réutilisable partout
→ prêt pour ISR */
export async function fetchGraphQL(query: string, variables = {}) {
  if (!endpoint) {
    throw new Error("WP_GRAPHQL_URL is not defined");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    WORDPRESS_FETCH_TIMEOUT_MS
  );

  let res: Response;

  try {
    res = await fetch(endpoint!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 60 },
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `WordPress GraphQL request failed: ${error.message}`
        : "WordPress GraphQL request failed"
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`WordPress GraphQL HTTP ${res.status}`);
  }

  const json = await res.json();

  /*if (json.errors) {
    console.error(json.errors);
    throw new Error("GraphQL error");
  }*/


  if (json.errors) {
  console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));

  throw new Error(
    json.errors.map((error: { message: string }) => error.message).join(" | ")
  );
}
  return json.data;
}
