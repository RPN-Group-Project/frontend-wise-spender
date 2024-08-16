import apiService from "./apiService.js";
import expenseTableBody from "./components/expenseTable.js";
import getStartAndEndOfWeek from "./utils/getStartAndEndOfWeek.js";
import groupByDayAndSum from "./utils/groupByDayAndSum.js";

$(document).ready(function () {
  // auto redirect to login if no token detected'
  if (!localStorage.getItem("token")) {
    window.location.href = "./auth/login.html";
  }

  if (localStorage.getItem("userName")) {
    $("#username").text(localStorage.getItem("userName"));
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

  // Alert close button
  $("#alert-close-button").click(function (e) {
    e.preventDefault();
    $("#alert").addClass("hidden");
  });

  const fetchDashboard = () => {
    showLoader();

    apiService
      .get("expense/user/sum")
      .done((response) => {
        const { data } = response;
        const expenses = data.expenses._sum.amount;
        const limit = data.userExpenseLimit.expense_limit;
        const expensePercentage = (expenses / limit) * 100;
        console.log(expenses, limit, expensePercentage);
        $("#money-spent").text(expenses);
        $("#limit-expense").text(limit);
        $("#dashboard-percentage").text(expensePercentage + "%");

        if (expensePercentage >= 100) {
          $("#alert-container").removeClass("hidden");
          $("#alert-container").addClass(
            "bg-red-100 border-red-400 text-red-700"
          );
          $("#alert-text").text("Looks like you're boros enough");
        } else if (expensePercentage >= 70) {
          $("#alert-container").removeClass("hidden");
          $("#alert-container").addClass(
            "bg-yellow-100 border-yellow-400 text-yellow-700"
          );
          $("#alert-text").text("Looks like you're close to your limit");
        } else if (expensePercentage >= 50) {
          $("#alert-container").removeClass("hidden");
          $("#alert-container").addClass(
            "bg-orange-100 border-orange-400 text-orange-700"
          );
          $("#alert-text").text("Looks like you're in half of your limit");
        }

        // doughnut chart
        const dataDoughnut = {
          labels: ["Money Expense", "Limit Expense"],
          datasets: [
            {
              label: "My First Dataset",
              data: [expenses, limit],
              borderColor: "rgba(0, 0, 0, 0)", // Menghapus border
              borderWidth: 0,
              backgroundColor: ["rgb(255,35,35)", "rgb(255, 199, 0)"],
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

        var chartBar = new Chart($("#chartDoughnut"), configDoughnut);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "./auth/login.html";
        }
      });
  };

  // Weekly Chart
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(new Date());
  const fetchWeeklyChart = () => {
    showLoader();
    apiService
      .get(
        `expense/user?take=100&startDate=${startOfWeek}&endDate=${endOfWeek}`
      )
      .done((response) => {
        const { data } = response;
        const {
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
        } = groupByDayAndSum(data);
        // chart
        const ctx = $("#myChart");

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Money Spent",
                data: [
                  monday,
                  tuesday,
                  wednesday,
                  thursday,
                  friday,
                  saturday,
                  sunday,
                ],
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

        hideLoader();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "./auth/login.html";
        }
      });
  };

  // History table
  const fetchHistory = () => {
    showLoader();
    // console.log(localStorage.getItem("tokenAuth"));
    apiService
      .get("expense/user?take=5")
      .done((response) => {
        const { data } = response;
        let tbody = $("#history-table-body");
        tbody.empty();
        hideLoader();
        data.forEach((item) => {
          tbody.append(
            expenseTableBody(
              item.date,
              item.Category.name,
              item.amount,
              item.description
            )
          );
        });
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "./auth/login.html";
        }
      });
  };

  fetchDashboard();
  fetchWeeklyChart();
  fetchHistory();
});
