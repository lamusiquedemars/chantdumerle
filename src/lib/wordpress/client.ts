const endpoint = process.env.WP_GRAPHQL_URL;

if (!endpoint) {
  throw new Error("WP_GRAPHQL_URL is not defined");
}

/* → simple
→ réutilisable partout
→ prêt pour ISR */
export async function fetchGraphQL(query: string, variables = {}) {
  const res = await fetch(endpoint!, {
    method: "POST",
    headers: {  
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error("GraphQL error");
  }

  return json.data;
}