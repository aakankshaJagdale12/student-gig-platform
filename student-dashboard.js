// =====================================================
// STUDENT DASHBOARD
// =====================================================


// -----------------------------------------------------
// GET LOGGED-IN USER
// -----------------------------------------------------

const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);


// -----------------------------------------------------
// CHECK LOGIN
// -----------------------------------------------------

if (!loggedInUser) {

    window.location.href = "login.html";

} else if (loggedInUser.role !== "student") {

    window.location.href = "client-dashboard.html";

}


// -----------------------------------------------------
// GET ELEMENTS
// -----------------------------------------------------

const jobsContainer =
    document.getElementById("jobsContainer");

const searchInput =
    document.getElementById("searchInput");

const areaFilter =
    document.getElementById("areaFilter");

const searchButton =
    document.getElementById("searchButton");

const logoutLink =
    document.getElementById("logoutLink");


// -----------------------------------------------------
// GET USER NAME
// -----------------------------------------------------

function updateUserInformation() {

    const name =
        loggedInUser.name || "Student";

    const sidebarUserName =
        document.getElementById("sidebarUserName");

    const dashboardUserName =
        document.getElementById("dashboardUserName");

    const topUserName =
        document.getElementById("topUserName");


    if (sidebarUserName) {
        sidebarUserName.textContent = name;
    }

    if (dashboardUserName) {
        dashboardUserName.textContent = name;
    }

    if (topUserName) {
        topUserName.textContent = name;
    }


    // Get first letter for avatar

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
// GET JOBS
// -----------------------------------------------------

const jobs =
    JSON.parse(localStorage.getItem("jobs")) || [];


// -----------------------------------------------------
// GET APPLICATIONS
// -----------------------------------------------------

function getApplications() {

    return JSON.parse(
        localStorage.getItem("applications")
    ) || [];

}


// -----------------------------------------------------
// UPDATE DASHBOARD STATS
// -----------------------------------------------------

function updateDashboardStats() {

    const applications =
        getApplications();


    const studentApplications =
        applications.filter(function(application) {

            return (
                application.studentEmail ===
                loggedInUser.email
            );

        });


    const acceptedApplications =
        studentApplications.filter(function(application) {

            return application.status === "accepted";

        });


    // Available jobs

    const availableJobsCount =
        document.getElementById(
            "availableJobsCount"
        );


    if (availableJobsCount) {

        availableJobsCount.textContent =
            jobs.length;

    }


    // Applications

    const applicationsCount =
        document.getElementById(
            "applicationsCount"
        );


    if (applicationsCount) {

        applicationsCount.textContent =
            studentApplications.length;

    }


    // Active gigs

    const activeJobsCount =
        document.getElementById(
            "activeJobsCount"
        );


    if (activeJobsCount) {

        activeJobsCount.textContent =
            acceptedApplications.length;

    }


    // Earnings

    let totalEarnings = 0;


    acceptedApplications.forEach(
        function(application) {

            totalEarnings +=
                Number(application.payment) || 0;

        }
    );


    const earningsCount =
        document.getElementById(
            "earningsCount"
        );


    if (earningsCount) {

        earningsCount.textContent =
            "₹" + totalEarnings;

    }

}


// -----------------------------------------------------
// DISPLAY JOBS
// -----------------------------------------------------

function displayJobs(jobList) {

    if (!jobsContainer) {
        return;
    }


    jobsContainer.innerHTML = "";


    if (jobList.length === 0) {

        jobsContainer.innerHTML = `
            <div class="empty-dashboard-state">
                No gigs found.
            </div>
        `;

        return;
    }


    jobList.forEach(function(job) {

        const jobCard =
            document.createElement("div");


        jobCard.classList.add(
            "job-card"
        );


        jobCard.innerHTML = `

            <h3>${job.title}</h3>

            <p>📍 ${job.location}</p>

            <p>📅 ${job.date}</p>

            <p>🕐 ${job.time}</p>

            <p>👥 ${job.students} Students Required</p>

            <p>💰 ₹${job.payment}</p>

            <p>${job.description}</p>

        `;


        const applyButton =
            document.createElement("button");


        applyButton.textContent =
            "Apply";


        applyButton.addEventListener(
            "click",
            function() {

                applyJob(job);

            }
        );


        jobCard.appendChild(applyButton);


        jobsContainer.appendChild(jobCard);

    });

}


// -----------------------------------------------------
// SEARCH + FILTER
// -----------------------------------------------------

function filterJobs() {

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const selectedArea =
        areaFilter
            ? areaFilter.value
            : "All Areas";


    const filteredJobs =
        jobs.filter(function(job) {

            const title =
                String(job.title || "")
                    .toLowerCase();

            const description =
                String(job.description || "")
                    .toLowerCase();

            const location =
                String(job.location || "")
                    .toLowerCase();


            const matchesSearch =
                title.includes(searchText) ||
                description.includes(searchText) ||
                location.includes(searchText);


            const matchesArea =
                selectedArea === "All Areas" ||
                location.includes(
                    selectedArea.toLowerCase()
                );


            return (
                matchesSearch &&
                matchesArea
            );

        });


    displayJobs(filteredJobs);

}


// Search button

if (searchButton) {

    searchButton.addEventListener(
        "click",
        filterJobs
    );

}


// Search when pressing Enter

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                filterJobs();

            }

        }
    );

}


// Area filter

if (areaFilter) {

    areaFilter.addEventListener(
        "change",
        filterJobs
    );

}


// -----------------------------------------------------
// APPLY FOR JOB
// -----------------------------------------------------

function applyJob(job) {

    const applications =
        getApplications();


    // Check duplicate application

    const alreadyApplied =
        applications.some(function(application) {

            return (
                application.jobId === job.jobId &&
                application.studentEmail ===
                loggedInUser.email
            );

        });


    if (alreadyApplied) {

        alert(
            "You have already applied for this job."
        );

        return;
    }


    // Create application

    const application = {

        applicationId: Date.now(),

        jobId: job.jobId,

        studentName:
            loggedInUser.name,

        studentEmail:
            loggedInUser.email,

        jobTitle:
            job.title,

        location:
            job.location,

        date:
            job.date,

        time:
            job.time,

        payment:
            job.payment,

        status:
            "pending"

    };


    applications.push(application);


    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );


    alert("Application submitted!");


    displayMyApplications();

    updateDashboardStats();

}


// -----------------------------------------------------
// DISPLAY MY APPLICATIONS
// -----------------------------------------------------

function displayMyApplications() {

    const container =
        document.getElementById(
            "myApplicationsContainer"
        );


    if (!container) {
        return;
    }


    const applications =
        getApplications();


    const myApplications =
        applications.filter(
            function(application) {

                return (
                    application.studentEmail ===
                    loggedInUser.email &&
                    application.status !==
                    "accepted"
                );

            }
        );


    if (myApplications.length === 0) {

        container.innerHTML = `
            <p class="empty-dashboard-state">
                No applications yet.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    myApplications.forEach(
        function(application) {

            const applicationCard =
                document.createElement("div");


            applicationCard.classList.add(
                "application-card"
            );


            applicationCard.innerHTML = `

                <h3>${application.jobTitle}</h3>

                <p>📍 ${application.location}</p>

                <p>📅 ${application.date}</p>

                <p>🕐 ${application.time}</p>

                <p>💰 ₹${application.payment}</p>

                <p>
                    Status:
                    <span class="status ${application.status}">
                        ${application.status}
                    </span>
                </p>

            `;


            container.appendChild(
                applicationCard
            );

        }
    );

}


// -----------------------------------------------------
// DISPLAY MY ACTIVE JOBS
// -----------------------------------------------------

function displayMyJobs() {

    const container =
        document.getElementById(
            "myJobsContainer"
        );


    if (!container) {
        return;
    }


    const applications =
        getApplications();


    const acceptedApplications =
        applications.filter(
            function(application) {

                return (
                    application.studentEmail ===
                    loggedInUser.email &&
                    application.status ===
                    "accepted"
                );

            }
        );


    if (acceptedApplications.length === 0) {

        container.innerHTML = `
            <p class="empty-dashboard-state">
                No accepted gigs yet.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    acceptedApplications.forEach(
        function(application) {

            const jobCard =
                document.createElement("div");


            jobCard.classList.add(
                "job-card"
            );


            jobCard.innerHTML = `

                <h3>${application.jobTitle}</h3>

                <p>📍 ${application.location}</p>

                <p>📅 ${application.date}</p>

                <p>🕐 ${application.time}</p>

                <p>💰 ₹${application.payment}</p>

                <p>
                    Status:
                    <span class="status accepted">
                        Accepted
                    </span>
                </p>

            `;


            container.appendChild(
                jobCard
            );

        }
    );

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

updateUserInformation();

updateDashboardStats();

displayJobs(jobs);

displayMyApplications();

displayMyJobs();