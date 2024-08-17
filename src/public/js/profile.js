import apiService from "./apiService.js";
import numberFormat from "./utils/numberFormat.js";
$(document).ready(function () {
  // auto redirect to login if no token detected'
  if (!localStorage.getItem("token")) {
    window.location.href = "../auth/login.html";
  }
  const userId = localStorage.getItem("userId");
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

  $("#logout-button").click(function () {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.href = "../auth/login.html";
  });

  // Fetch history
  const fetchUser = () => {
    showLoader();
    apiService
      .get(`users/${userId}`)
      .done((response) => {
        const { data } = response;
        $("#username").html(data.name);
        $("#target-expense").html(numberFormat(data.expense_limit));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "../auth/login.html";
        }
      });
  };

  fetchUser();
});
