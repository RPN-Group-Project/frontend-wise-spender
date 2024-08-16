import apiService from "./apiService.js";

$(document).ready(function () {
  // auto redirect to login if no token detected'
  if (!localStorage.getItem("token")) {
    window.location.href = "./auth/login.html";
  }
  // get userId
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

  //   Put Today for Form Default Value
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  $("#date").val(todayString);

  const fetchCategories = () => {
    showLoader();
    apiService.get(`category?userId=${userId}`).done((response) => {
      const { data } = response;

      data.forEach((item) => {
        $("#category-select").append(
          `<option value="${item.id}">${item.name}</option>`
        );
      });
    });
  };

  $("#add-expense-form").submit(function (e) {
    e.preventDefault();
    showLoader();
    const description = $("#description").val();
    const category_id = $("#category-select").val();
    const date = $("#date").val();
    const amount = $("#amount").val();

    if (category_id === "Select Category") {
      alert("Please select a category");
      return;
    }

    if (!amount || !description || !date || !category_id) {
      alert("Please fill in all required fields.");
      return;
    }
    apiService
      .post(`expense`, {
        description,
        date,
        category_id,
        amount,
      })
      .done((response) => {
        const { data } = response;
        console.log(data);
        hideLoader();
        alert("Expense Added Successfully");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1500);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.log(errorThrown);
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "../auth/login.html";
        }
      });
    hideLoader();
  });

  fetchCategories();
});
