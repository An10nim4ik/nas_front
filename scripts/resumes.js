document.addEventListener("DOMContentLoaded", () => {
    if (!getAuthToken()) {
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.innerHTML = '<p style="text-align:center; padding: 20px;">Please <a href="auth.html">login</a> to view and manage resumes.</p>';
        return;
    }

    const resumeUploadInput = document.getElementById("resumeInput");
    const uploadStatusP = document.getElementById("uploadStatus");
    const resumeListUL = document.getElementById("resumeList");
    const buildResumeForm = document.getElementById("resumeForm");
    const buildResumeSubmitButton = buildResumeForm ? buildResumeForm.querySelector('button[type="submit"]') : null;

    let currentEditResumeId = null;

    async function loadUserResumes() {
        if (!resumeListUL) {
            console.error("Resume list UL element not found (#resumeList).");
            return;
        }
        resumeListUL.innerHTML = '<li>Loading resumes...</li>';

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/resume/me?limit=50`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: `Failed to fetch resumes: ${response.statusText}` }));
                throw new Error(errorData.detail || `Server error ${response.status}`);
            }
            const resumes = await response.json();

            resumeListUL.innerHTML = '';
            if (resumes.length === 0) {
                resumeListUL.innerHTML = '<li>No resumes found. Create one by text or upload a file.</li>';
                return;
            }

            resumes.forEach(resume => {
                const listItem = document.createElement('li');
                listItem.className = "resume-item";

                let displayName = `Resume (ID: ${resume.id})`;
                if (resume.file_name) {
                    displayName = resume.file_name;
                } else if (resume.skills) {
                    displayName = `Resume (Skills: ${resume.skills.substring(0, 25)}...)`;
                }
                
                const createdDate = resume.created_at ? new Date(resume.created_at).toLocaleDateString() : 'N/A';
                const hasFile = !!resume.file_name;

                listItem.innerHTML = `
                    <span>${displayName} - Created: ${createdDate}</span>
                    <div class="resume-buttons">
                        ${hasFile ? `<button class="btn download" data-id="${resume.id}">Download</button>` : ''}
                        <button class="btn edit" data-id="${resume.id}">Edit Text</button>
                        <button class="btn delete" data-id="${resume.id}">Delete</button>
                    </div>
                `;
                resumeListUL.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error loading resumes:", error);
            if (resumeListUL) resumeListUL.innerHTML = `<li>Error loading resumes: ${error.message}</li>`;
        }
    }

    async function handleResumeFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (uploadStatusP) uploadStatusP.textContent = "Uploading...";

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/resume/upload`, {
                method: 'POST',
                body: formData,
            });
            
            const result = await response.json();
            if (response.ok) {
                if (uploadStatusP) uploadStatusP.textContent = "✅ File uploaded successfully!";
                loadUserResumes();
            } else {
                if (uploadStatusP) uploadStatusP.textContent = `❌ Error: ${result.detail || response.statusText}`;
            }
        } catch (error) {
            console.error("File upload error:", error);
            if (uploadStatusP) uploadStatusP.textContent = `❌ Network error during upload.`;
        } finally {
            if(resumeUploadInput) resumeUploadInput.value = "";
        }
    }

    async function handleBuildOrUpdateResumeSubmit(event) {
        event.preventDefault();
        if (!buildResumeForm) return;


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

        const skills = buildResumeForm.querySelector('textarea[name="skills"]').value;
        const experience = buildResumeForm.querySelector('textarea[name="experience"]').value;
        const education = buildResumeForm.querySelector('textarea[name="education"]').value;
        const experienceDetails = buildResumeForm.querySelector('textarea[name="experience_details"]').value;

        if (!skills && !experience && !education && !experienceDetails) {
            alert("Please fill in at least one field (Skills, Experience, Education, or Summary/Experience Details).");
            return;
        }

        const payload = {
            skills: skills || null,
            experience: experience || null,
            education: education || null,
            experience_details: experienceDetails || null
        };

        const method = currentEditResumeId ? 'PUT' : 'POST';
        const endpoint = currentEditResumeId ? `${API_BASE_URL}/resume/${currentEditResumeId}` : `${API_BASE_URL}/resume/text`;
        const actionText = currentEditResumeId ? "updating" : "creating";

        try {
            const response = await fetchWithAuth(endpoint, {
                method: method,
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok) {
                alert(`Resume ${actionText.slice(0,-3)}ed successfully!`);
                buildResumeForm.reset();
                if (buildResumeSubmitButton) buildResumeSubmitButton.textContent = "Generate Resume";
                currentEditResumeId = null;
                loadUserResumes();
            } else {
                alert(`Error ${actionText} resume: ${result.detail || response.statusText}`);
            }
        } catch (error) {
            console.error(`Error ${actionText} resume:`, error);
            alert(`Network error ${actionText} resume.`);
        }
    }
    
    async function handleDeleteResume(resumeId) {
        if (!confirm("Are you sure you want to delete resume ID: " + resumeId + "?")) return;
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/resume/${resumeId}`, {
                method: 'DELETE',
            });
            if (response.status === 204) {
                alert("Resume deleted successfully.");
                loadUserResumes();
            } else if (!response.ok) {
                const errorData = await response.json().catch(() => ({detail: `Failed to delete: ${response.statusText}`}));
                alert(`Error deleting resume: ${errorData.detail}`);
            } else {
                loadUserResumes();
            }
        } catch (error) {
            console.error("Error deleting resume:", error);
            alert("Network error during deletion.");
        }
    }

    async function handleDownloadResume(resumeId) {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/resume/${resumeId}/download`);
            if (!response.ok) {
                let errorDetail = "Failed to download file.";
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.detail || errorDetail;
                } catch (e) { /* Ignore if response is not JSON */ }
                throw new Error(errorDetail);
            }
            const blob = await response.blob();
            const disposition = response.headers.get('content-disposition');
            let filename = `resume_${resumeId}.dat`;
            if (disposition && disposition.includes('filename=')) {
                const filenameMatch = disposition.match(/filename\*?=['"]?(?:UTF-\d'')?([^;\r\n"']*)['"]?;?/i);
                if (filenameMatch && filenameMatch[1]) {
                    try {
                        filename = decodeURIComponent(filenameMatch[1]);
                    } catch (e) { // Fallback for non-standard encoding
                         const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
                         if(plainMatch && plainMatch[1]) filename = plainMatch[1];
                    }
                }
            }
            
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Download error:", error);
            alert(`Error downloading resume: ${error.message}`);
        }
    }
    
    async function populateFormForEdit(resumeId) {
        if (!buildResumeForm) return;
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/resume/${resumeId}`);
            if(!response.ok) {
                const err = await response.json().catch(() => null);
                throw new Error(err?.detail || "Could not fetch resume for editing.");
            }
            const resumeData = await response.json();

            buildResumeForm.querySelector('textarea[name="skills"]').value = resumeData.skills || "";
            buildResumeForm.querySelector('textarea[name="experience"]').value = resumeData.experience || "";
            buildResumeForm.querySelector('textarea[name="education"]').value = resumeData.education || "";
            buildResumeForm.querySelector('textarea[name="experience_details"]').value = resumeData.experience_details || "";

            currentEditResumeId = resumeId;
            if(buildResumeSubmitButton) {
                buildResumeSubmitButton.textContent = "Update Resume";
            }
            buildResumeForm.scrollIntoView({ behavior: 'smooth' });
        } catch(error) {
            console.error("Error preparing for edit:", error);
            alert(`Error preparing resume for edit: ${error.message}`);
            currentEditResumeId = null;
            if(buildResumeSubmitButton) buildResumeSubmitButton.textContent = "Generate Resume";
        }
    }

    if (resumeListUL) {
        resumeListUL.addEventListener('click', function(event) {
            const targetButton = event.target.closest('button.btn');
            if (!targetButton) return;
            const resumeId = targetButton.dataset.id;
            if (!resumeId) return;

            if (targetButton.classList.contains('delete')) handleDeleteResume(resumeId);
            else if (targetButton.classList.contains('download')) handleDownloadResume(resumeId);
            else if (targetButton.classList.contains('edit')) populateFormForEdit(resumeId);
        });
    }


    if (resumeUploadInput) {
        resumeUploadInput.addEventListener("change", handleResumeFileUpload);
    }
    if (buildResumeForm) {
        buildResumeForm.addEventListener("submit", handleBuildOrUpdateResumeSubmit); 
    }


        uploadStatus.textContent = "✅ File uploaded successfully!";
        fileInput.value = ""; 
    });
});

    loadUserResumes();
});
