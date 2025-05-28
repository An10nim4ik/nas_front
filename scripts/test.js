const sidebarItems = document.querySelectorAll(".sidebar li");
const tabContents = document.querySelectorAll(".tab-content");

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {

    sidebarItems.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    tabContents.forEach((tab) => tab.classList.add("hidden"));

    const tabId = item.getAttribute("data-tab");
    document.getElementById(tabId).classList.remove("hidden");
  });
});