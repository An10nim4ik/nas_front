const sidebarItems = document.querySelectorAll(".sidebar li");
const tabContents = document.querySelectorAll(".tab-content");

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active from all
    sidebarItems.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    // Hide all tab contents
    tabContents.forEach((tab) => tab.classList.add("hidden"));

    // Show selected tab
    const tabId = item.getAttribute("data-tab");
    document.getElementById(tabId).classList.remove("hidden");
  });
});

document.getElementById("resumeUpload").addEventListener("change", function () {
  const file = this.files[0];
  const resumeName = document.getElementById("resume-name");
  if (file && file.type === "application/pdf") {
    resumeName.textContent = `Uploaded: ${file.name}`;
  } else {
    resumeName.textContent = "Please upload a valid PDF file.";
  }
});

