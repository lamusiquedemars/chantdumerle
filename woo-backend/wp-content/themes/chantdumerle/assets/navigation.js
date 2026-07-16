(function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-navigation");
	const cartBadge = document.querySelector("[data-cart-count]");

	async function refreshCartCount() {
		if (!cartBadge) {
			return;
		}

		try {
			const response = await fetch("/wp-json/cdm/v1/cart", {
				cache: "no-store",
				credentials: "same-origin",
			});

			if (!response.ok) {
				return;
			}

			const payload = await response.json();
			const count = Math.max(0, Number(payload.itemCount) || 0);
			cartBadge.textContent = String(count);
			cartBadge.hidden = count === 0;
		} catch (_error) {
			// Le rendu PHP initial reste la source de secours si Woo est indisponible.
		}
	}

	if (toggle && nav) {
		toggle.addEventListener("click", function () {
			const expanded = toggle.getAttribute("aria-expanded") === "true";
			toggle.setAttribute("aria-expanded", String(!expanded));
			nav.classList.toggle("is-open", !expanded);
		});

		nav.addEventListener("click", function (event) {
			if (event.target instanceof HTMLAnchorElement) {
				toggle.setAttribute("aria-expanded", "false");
				nav.classList.remove("is-open");
			}
		});
	}

	void refreshCartCount();

	if (window.jQuery) {
		window.jQuery(document.body).on(
			"item_removed_from_classic_cart updated_wc_div updated_cart_totals wc_cart_emptied",
			function () {
				void refreshCartCount();
			}
		);
	}
})();
