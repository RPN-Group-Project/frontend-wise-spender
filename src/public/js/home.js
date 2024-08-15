$(document).ready(function () {
  // auto redirect to login if no token detected'
  if (!localStorage.getItem("token")) {
    window.location.href = "./auth/login.html";
  }
  
  const disableScroll = () => {
    $(window).on("scroll.disableScroll", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.scrollTo(0, 0);
    });
  };

  const enableScroll = () => {
    $(window).off("scroll.disableScroll");
  };

  const showLoader = () => {
    $("#loader-wrapper").removeClass("hidden");
    disableScroll();
  };

  const hideLoader = () => {
    $("#loader-wrapper").addClass("hidden");
    enableScroll();
  };

  // chart
  const ctx = $("#myChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3, 10],
          backgroundColor: "#3572EF",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // doughnut chart
  const dataDoughnut = {
    labels: ["Money Expense", "Limit Expense"],
    datasets: [
      {
        label: "My First Dataset",
        data: [10, 100],
        borderColor: "rgba(0, 0, 0, 0)", // Menghapus border
        borderWidth: 0,
        backgroundColor: ["rgb(58, 190, 249)", "rgb(255, 199, 0)"],
        hoverOffset: 4,
      },
    ],
  };

  const configDoughnut = {
    type: "doughnut",
    data: dataDoughnut,
    options: {
      cutout: "75%",
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  };

  var chartBar = new Chart(
    document.getElementById("chartDoughnut"),
    configDoughnut
  );

  // Alert close button
  $("#alert-close-button").click(function (e) {
    e.preventDefault();
    $("#alert").addClass("hidden");
  });

  // Alert show
});
