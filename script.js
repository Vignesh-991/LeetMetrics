document.addEventListener("DOMContentLoaded", () => {
  // Search elements
  const searchButton = document.getElementById("Search");
  const userNameInput = document.getElementById("input-field");
  // Difficulty labels
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  // Progress circles
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  // Overview statistics
  const totalSolved = document.getElementById("total-solved");
  const acceptanceRate = document.getElementById("acceptance-rate");
  const ranking = document.getElementById("ranking");
  const contribution = document.getElementById("contribution");
  // Topic analysis container
  const topicContainer = document.getElementById("topic-container");
  //   Fetch LeetCode User Details
  async function fetchUserDetails(user) {
    try {
      const url = `https://leetcode-stats.tashif.codes/${user}/stats`;
      const data = await fetch(url);
      // Check HTTP response
      if (!data.ok) {
        throw new Error(`HTTP error: ${data.status}`);
      }
      // Convert response to JSON
      const response = await data.json();
      console.log(response);
      // Display the received data
      displayUserData(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert(
        "Unable to fetch LeetCode data. Please check the username and try again.",
      );
    }
  }
  // Update Progress Circle
  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }
  // Display User Data

  function displayUserData(response) {
    // Difficulty Statistics

    const easyTotalQuestions = response.totalEasy;
    const mediumTotalQuestions = response.totalMedium;
    const hardTotalQuestions = response.totalHard;
    const easySolvedQuestions = response.easySolved;
    const mediumSolvedQuestions = response.mediumSolved;
    const hardSolvedQuestions = response.hardSolved;
    // Update Easy circle
    updateProgress(
      easySolvedQuestions,
      easyTotalQuestions,
      easyLabel,
      easyProgressCircle,
    );
    // Update Medium circle
    updateProgress(
      mediumSolvedQuestions,
      mediumTotalQuestions,
      mediumLabel,
      mediumProgressCircle,
    );
    // Update Hard circle
    updateProgress(
      hardSolvedQuestions,
      hardTotalQuestions,
      hardLabel,
      hardProgressCircle,
    );
    // Overview Statistics
    totalSolved.textContent = response.totalSolved;
    acceptanceRate.textContent = `${response.acceptanceRate}%`;
    ranking.textContent = response.ranking.toLocaleString();
    contribution.textContent = response.contributionPoints.toLocaleString();
    // Topic Analysis
    displayTopics(response.data.topicAnalysis || []);
  }
  // Display Topic Analysis
  function displayTopics(topics) {
    // Remove previous topics
    topicContainer.innerHTML = "";
    // Make sure topics is an array
    if (!Array.isArray(topics) || topics.length === 0) {
      topicContainer.innerHTML = `
                <p class="no-topics">
                    Topic analysis is not available for this user.
                </p>
            `;
      return;
    }
    // Sort topics from highest to lowest
    const sortedTopics = [...topics].sort((a, b) => b.count - a.count);
    // Show only top 5 topics
    const topTopics = sortedTopics.slice(0, 5);
    // Find highest topic count
    const maxCount = topTopics[0].count;
    // Create each topic row
    topTopics.forEach((topic) => {
      // Main row
      const topicRow = document.createElement("div");
      topicRow.classList.add("topic-row");
      // Topic name
      const topicName = document.createElement("span");
      topicName.classList.add("topic-name");
      topicName.textContent = topic.topic;
      // Topic count
      const topicCount = document.createElement("span");
      topicCount.classList.add("topic-count");
      topicCount.textContent = topic.count;
      // Progress bar container
      const progressBarContainer = document.createElement("div");
      progressBarContainer.classList.add("topic-progress-container");
      // Progress bar
      const progressBar = document.createElement("div");
      progressBar.classList.add("topic-progress");
      // Calculate relative width
      const percentage = (topic.count / maxCount) * 100;
      progressBar.style.width = `${percentage}%`;
      // Put progress bar inside container
      progressBarContainer.appendChild(progressBar);
      // Put everything inside row
      topicRow.appendChild(topicName);
      topicRow.appendChild(progressBarContainer);
      topicRow.appendChild(topicCount);
      // Add row to topic container
      topicContainer.appendChild(topicRow);
    });
  }
  // Search Button
  searchButton.addEventListener("click", () => {
    const username = userNameInput.value.trim();
    // Check empty username
    if (username === "") {
      alert("Username can't be empty");
      return;
    }
    // Fetch user information
    fetchUserDetails(username);
  });
});
