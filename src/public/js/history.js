import apiService from "./apiService.js";
import expenseTableBody from "./components/expenseTable.js";
import pagination from "./components/pagination.js";

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

  //   Put Last Week and Today fo Form Default Value
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Get the date for one week ago
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const lastWeekString = lastWeek.toISOString().split("T")[0];
  $("#start-date").val(lastWeekString);
  $("#end-date").val(todayString);

  // Form Submit
  $("input[type='date']").on("change", function (e) {
    e.preventDefault();
    const startDate = $("#start-date").val();
    const endDate = $("#end-date").val();
    if (startDate > endDate) {
      alert("Start Date cannot be greater than End Date");
      $("#end-date").val(todayString);
      return;
    }
    showLoader();
    apiService
      .get(`expense/user?take=7&startDate=${startDate}&endDate=${endDate}`)
      .done((response) => {
        const { data } = response;

        let tbody = $("#history-table-body");
        tbody.empty();
        data.forEach((item) => {
          console.log(item);
          tbody.append(
            expenseTableBody(
              item.date,
              item.Category.name,
              item.amount,
              item.description
            )
          );
        });
        hideLoader();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "./auth/login.html";
        }
      });
  });

  // Fetch history
  const fetchHistory = (page = 1) => {
    showLoader();
    apiService
      .get(`expense/user?take=7&page=${page}`)
      .done((response) => {
        console.log(response);
        const { data, metadata } = response;
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
        $("#pagination").empty();
        $("#pagination").append(pagination(metadata));
        $("li").on("click", function () {
          const page = $(this).data("value");
          fetchHistory(page);
        });
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "./auth/login.html";
        }
      });
  };

  fetchHistory();
});
