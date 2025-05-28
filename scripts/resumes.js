document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const uploadStatus = document.getElementById("uploadStatus");
    const resumeList = document.getElementById("resumeItems");

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const listItem = document.createElement("li");
        listItem.className = "resume-item";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = file.name;

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "resume-buttons";

        const fileURL = URL.createObjectURL(file);

        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View";
        viewBtn.onclick = () => window.open(fileURL, "_blank");

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = fileURL;
            a.download = file.name;
            a.click();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            listItem.remove();
            URL.revokeObjectURL(fileURL);
        };

        buttonsDiv.append(viewBtn, downloadBtn, deleteBtn);
        listItem.append(nameSpan, buttonsDiv);
        resumeList.appendChild(listItem);

        uploadStatus.textContent = "✅ File uploaded successfully!";
        fileInput.value = ""; 
    });
});
