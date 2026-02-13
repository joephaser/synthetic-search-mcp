import { test } from "node:test";
import assert from "node:assert";

const SYNTHETIC_API_KEY = process.env.SYNTHETIC_API_KEY;
const SYNTHETIC_SEARCH_URL = "https://api.synthetic.new/v2/search";

test("Synthetic Search API - should return search results", async () => {
  if (!SYNTHETIC_API_KEY) {
    console.log("Skipping test: SYNTHETIC_API_KEY not set");
    return;
  }

  const response = await fetch(SYNTHETIC_SEARCH_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SYNTHETIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: "test query" }),
  });

  assert.strictEqual(response.ok, true, `API request failed: ${response.status} ${response.statusText}`);
  
  const data = await response.json();
  assert.ok(data.results, "Response should have results array");
  assert.ok(Array.isArray(data.results), "Results should be an array");
  
  if (data.results.length > 0) {
    const result = data.results[0];
    assert.ok(result.url, "Result should have URL");
    assert.ok(result.title, "Result should have title");
    assert.ok(result.text, "Result should have text");
    assert.ok(result.published, "Result should have published date");
  }
  
  console.log("✓ Search API test passed");
});

test("Synthetic Search API - should handle invalid API key", async () => {
  const response = await fetch(SYNTHETIC_SEARCH_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer invalid_key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: "test" }),
  });

  assert.strictEqual(response.ok, false, "Should fail with invalid API key");
  console.log("✓ Invalid API key test passed");
});
