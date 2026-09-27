// =====================================================
// CLIENT DASHBOARD
// =====================================================


// -----------------------------------------------------
// GET LOGGED-IN CLIENT
// -----------------------------------------------------

const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);


// -----------------------------------------------------
// CHECK LOGIN
// -----------------------------------------------------

if (!loggedInUser) {

    window.location.href = "login.html";

} else if (loggedInUser.role !== "client") {

    window.location.href = "student-dashboard.html";

}


// -----------------------------------------------------
// ELEMENTS
// -----------------------------------------------------

const form =
    document.getElementById("jobForm");

const message =
    document.getElementById("message");

const applicationsContainer =
    document.getElementById("applicationsContainer");

const myPostedJobsContainer =
    document.getElementById("myPostedJobsContainer");

const logoutLink =
    document.getElementById("logoutLink");


// -----------------------------------------------------
// UPDATE CLIENT INFORMATION
// -----------------------------------------------------

function updateClientInformation() {

    const name =
        loggedInUser.name || "Client";

    const sidebarName =
        document.getElementById("sidebarClientName");

    const dashboardName =
        document.getElementById("dashboardClientName");

    const topName =
        document.getElementById("topClientName");


    if (sidebarName) {
        sidebarName.textContent = name;
    }

    if (dashboardName) {
        dashboardName.textContent = name;
    }

    if (topName) {
        topName.textContent = name;
    }


    // First letter for avatar

    const firstLetter =
        name.charAt(0).toUpperCase();


    const avatars =
        document.querySelectorAll(
            ".user-avatar, .top-avatar"
        );


    avatars.forEach(function(avatar) {

        avatar.textContent = firstLetter;

    });

}


// -----------------------------------------------------
// GET DATA
// -----------------------------------------------------

function getJobs() {

    return JSON.parse(
        localStorage.getItem("jobs")
    ) || [];

}


function getApplications() {

    return JSON.parse(
        localStorage.getItem("applications")
    ) || [];

}


// -----------------------------------------------------
// GET THIS CLIENT'S JOBS
// -----------------------------------------------------

function getClientJobs() {

    const jobs = getJobs();


    return jobs.filter(function(job) {

        return (
            job.clientEmail ===
            loggedInUser.email
        );

    });

}


// -----------------------------------------------------
// UPDATE DASHBOARD STATS
// -----------------------------------------------------

function updateDashboardStats() {

    const clientJobs =
        getClientJobs();


    const allApplications =
        getApplications();


    const clientJobIds =
        clientJobs.map(function(job) {

            return job.jobId;

        });


    const clientApplications =
        allApplications.filter(
            function(application) {

                return clientJobIds.includes(
                    application.jobId
                );

            }
        );


    const acceptedApplications =
        clientApplications.filter(
            function(application) {

                return (
                    application.status ===
                    "accepted"
                );

            }
        );


    // ---------------------------------------------
    // Posted gigs
    // ---------------------------------------------

    const postedJobsCount =
        document.getElementById(
            "postedJobsCount"
        );


    if (postedJobsCount) {

        postedJobsCount.textContent =
            clientJobs.length;

    }


    // ---------------------------------------------
    // Applications
    // ---------------------------------------------

    const applicationsReceivedCount =
        document.getElementById(
            "applicationsReceivedCount"
        );


    if (applicationsReceivedCount) {

        applicationsReceivedCount.textContent =
            clientApplications.length;

    }


    // ---------------------------------------------
    // Accepted
    // ---------------------------------------------

    const acceptedApplicationsCount =
        document.getElementById(
            "acceptedApplicationsCount"
        );


    if (acceptedApplicationsCount) {

        acceptedApplicationsCount.textContent =
            acceptedApplications.length;

    }


    // ---------------------------------------------
    // Total posted value
    // ---------------------------------------------

    let totalPostedValue = 0;


    clientJobs.forEach(function(job) {

        totalPostedValue +=
            Number(job.payment) || 0;

    });


    const totalPostedValueElement =
        document.getElementById(
            "totalPostedValue"
        );


    if (totalPostedValueElement) {

        totalPostedValueElement.textContent =
            "₹" + totalPostedValue;

    }

}


// -----------------------------------------------------
// POST JOB
// -----------------------------------------------------

if (form) {

    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "jobTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const location =
                document.getElementById(
                    "location"
                ).value.trim();


            const date =
                document.getElementById(
                    "date"
                ).value;


            const time =
                document.getElementById(
                    "time"
                ).value;


            const students =
                document.getElementById(
                    "students"
                ).value;


            const payment =
                document.getElementById(
                    "payment"
                ).value;


            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (
                title === "" ||
                description === "" ||
                location === "" ||
                date === "" ||
                time === "" ||
                students === "" ||
                payment === ""
            ) {

                if (message) {

                    message.textContent =
                        "Please fill all the fields.";

                    message.style.color =
                        "#c85c73";

                }

                return;
            }


            // -----------------------------------------
            // CREATE JOB
            // -----------------------------------------

            const job = {

                jobId: Date.now(),

                title: title,

                description: description,

                location: location,

                date: date,

                time: time,

                students: students,

                payment: payment,

                clientEmail:
                    loggedInUser.email

            };


            // -----------------------------------------
            // GET EXISTING JOBS
            // -----------------------------------------

            const jobs =
                getJobs();


            // Add job

            jobs.push(job);


            // Save

            localStorage.setItem(
                "jobs",
                JSON.stringify(jobs)
            );


            // -----------------------------------------
            // SUCCESS MESSAGE
            // -----------------------------------------

            if (message) {

                message.textContent =
                    "Your gig was posted successfully!";

                message.style.color =
                    "#3b956f";

            }


            // Clear form

            form.reset();


            // Update UI

            displayMyPostedJobs();

            updateDashboardStats();

        }
    );

}


// -----------------------------------------------------
// DISPLAY MY POSTED JOBS
// -----------------------------------------------------

function displayMyPostedJobs() {

    if (!myPostedJobsContainer) {
        return;
    }


    const clientJobs =
        getClientJobs();


    if (clientJobs.length === 0) {

        myPostedJobsContainer.innerHTML = `
            <div class="empty-dashboard-state">
                No jobs posted yet.
            </div>
        `;

        return;
    }


    myPostedJobsContainer.innerHTML = "";


    clientJobs.forEach(function(job) {

        const jobCard =
            document.createElement("div");


        jobCard.classList.add(
            "job-card"
        );


        jobCard.innerHTML = `

            <h3>
                ${job.title}
            </h3>

            <p>
                📍 ${job.location}
            </p>

            <p>
                📅 ${job.date}
            </p>

            <p>
                🕐 ${job.time}
            </p>

            <p>
                👥 ${job.students} Students Required
            </p>

            <p>
                💰 ₹${job.payment}
            </p>

            <p>
                ${job.description}
            </p>

            <button
                class="delete-job-button"
                onclick="deleteJob(${job.jobId})"
            >
                Delete Job
            </button>

        `;


        myPostedJobsContainer.appendChild(
            jobCard
        );

    });

}


// -----------------------------------------------------
// DISPLAY APPLICATIONS
// -----------------------------------------------------

function displayApplications() {

    if (!applicationsContainer) {
        return;
    }


    const clientJobs =
        getClientJobs();


    const allApplications =
        getApplications();


    const clientJobIds =
        clientJobs.map(function(job) {

            return job.jobId;

        });


    const applications =
        allApplications.filter(
            function(application) {

                return clientJobIds.includes(
                    application.jobId
                );

            }
        );


    if (applications.length === 0) {

        applicationsContainer.innerHTML = `
            <p class="empty-dashboard-state">
                No applications yet.
            </p>
        `;

        return;
    }


    applicationsContainer.innerHTML = "";


    applications.forEach(
        function(application) {

            const applicationCard =
                document.createElement("div");


            applicationCard.classList.add(
                "application-card"
            );


            applicationCard.innerHTML = `

                <h3>
                    ${application.jobTitle}
                </h3>

                <p>
                    👤 Student:
                    ${application.studentName}
                </p>

                <p>
                    📧 ${application.studentEmail}
                </p>

                <p>
                    📍 ${application.location}
                </p>

                <p>
                    📅 ${application.date}
                </p>

                <p>
                    🕐 ${application.time}
                </p>

                <p>
                    💰 ₹${application.payment}
                </p>

                <p>
                    📌 Status:
                    <span class="status ${application.status}">
                        ${application.status}
                    </span>
                </p>

            `;


            // -----------------------------------------
            // BUTTONS
            // -----------------------------------------

            if (
                application.status ===
                "pending"
            ) {

                const acceptButton =
                    document.createElement(
                        "button"
                    );


                acceptButton.textContent =
                    "Accept";


                acceptButton.addEventListener(
                    "click",
                    function() {

                        acceptApplication(
                            application.applicationId
                        );

                    }
                );


                const rejectButton =
                    document.createElement(
                        "button"
                    );


                rejectButton.textContent =
                    "Reject";


                rejectButton.addEventListener(
                    "click",
                    function() {

                        rejectApplication(
                            application.applicationId
                        );

                    }
                );


                applicationCard.appendChild(
                    acceptButton
                );

                applicationCard.appendChild(
                    rejectButton
                );

            }


            applicationsContainer.appendChild(
                applicationCard
            );

        }
    );

}


// -----------------------------------------------------
// ACCEPT APPLICATION
// -----------------------------------------------------

function acceptApplication(
    applicationId
) {

    const applications =
        getApplications();


    const updatedApplications =
        applications.map(
            function(application) {

                if (
                    application.applicationId ===
                    applicationId
                ) {

                    application.status =
                        "accepted";

                }

                return application;

            }
        );


    localStorage.setItem(
        "applications",
        JSON.stringify(
            updatedApplications
        )
    );


    displayApplications();

    updateDashboardStats();

}


// -----------------------------------------------------
// REJECT APPLICATION
// -----------------------------------------------------

function rejectApplication(
    applicationId
) {

    const applications =
        getApplications();


    const updatedApplications =
        applications.map(
            function(application) {

                if (
                    application.applicationId ===
                    applicationId
                ) {

                    application.status =
                        "rejected";

                }

                return application;

            }
        );


    localStorage.setItem(
        "applications",
        JSON.stringify(
            updatedApplications
        )
    );


    displayApplications();

    updateDashboardStats();

}


// -----------------------------------------------------
// DELETE JOB
// -----------------------------------------------------

function deleteJob(jobId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this job?"
        );


    if (!confirmDelete) {
        return;
    }


    // ---------------------------------------------
    // Delete job
    // ---------------------------------------------

    let jobs =
        getJobs();


    jobs =
        jobs.filter(function(job) {

            return job.jobId !== jobId;

        });


    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );


    // ---------------------------------------------
    // Delete applications related to job
    // ---------------------------------------------

    let applications =
        getApplications();


    applications =
        applications.filter(
            function(application) {

                return (
                    application.jobId !==
                    jobId
                );

            }
        );


    localStorage.setItem(
        "applications",
        JSON.stringify(
            applications
        )
    );


    // Update dashboard

    displayMyPostedJobs();

    displayApplications();

    updateDashboardStats();

}


// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------

if (logoutLink) {

    logoutLink.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            localStorage.removeItem(
                "loggedInUser"
            );


            window.location.href =
                "login.html";

        }
    );

}


// -----------------------------------------------------
// INITIAL LOAD
// -----------------------------------------------------

updateClientInformation();

updateDashboardStats();

displayMyPostedJobs();

displayApplications();