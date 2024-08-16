import apiService from "./apiService.js";
import expenseTableBody from "./components/expenseTable.js";
import pagination from "./components/pagination.js";
import numberFormat from "./utils/numberFormat.js";

$(document).ready(function () {
  // auto redirect to login if no token detected'
  if (!localStorage.getItem("token")) {
    window.location.href = "../auth/login.html";
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

  //  Get Todays Date
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const formattedDate = formatter.format(today);

  // Fetch history
  const fetchHistory = (page = 1) => {
    showLoader();
    apiService
      .get(
        `expense/user?take=7&page=${page}&startDate=${todayString}&endDate=${todayString}`
      )
      .done((response) => {
        const { data, metadata } = response;

        $("#date").text(formattedDate);
        const sumAllAmount = data
          .map((item) => item.amount)
          .reduce((a, b) => a + b, 0);
        $("#today-spent").text("Rp. " + numberFormat(sumAllAmount));

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
          window.location.href = "../auth/login.html";
        }
      });
  };

  fetchHistory();
});
