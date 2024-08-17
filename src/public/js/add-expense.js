import apiService from "./apiService.js";

const now = new Date();
const startOfMonth = new Date(
  now.getFullYear(),
  now.getMonth(),
  1
).toISOString();
const endOfMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  0
).toISOString();
const filterAndSum = (data) => {
  const filteredData = data.filter((item) => {
    return item.date >= startOfMonth && item.date <= endOfMonth;
  });

  const sum = filteredData
    .map((item) => item.amount)
    .reduce((a, b) => a + b, 0);
  return sum;
};

$(document).ready(function () {
  // auto redirect to login if no token detected'
  if (!localStorage.getItem("token") || !localStorage.getItem("userId")) {
    window.location.href = "../auth/login.html";
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
        const currentAmount = filterAndSum(item.expenses);
        $("#category-select").append(
          `<option data-amount="${currentAmount}" data-limit="${item.monthly_budget}" value="${item.id}">${item.name}</option>`
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
    const amount = Number($("#amount").val());

    if (category_id === "Select Category") {
      Swal.fire({
        title: "Oops!",
        text: "Please select a category",
        icon: "warning",
      });
      return;
    }

    if (!amount || !description || !date || !category_id) {
      Swal.fire({
        title: "Oops!",
        text: "Please fill in all fields",
        icon: "warning",
      });
      return;
    }

    const categoryTotalAmount = $("option:selected").data("amount");
    const categoryLimit = $("option:selected").data("limit");

    if (categoryTotalAmount > categoryLimit) {
      Swal.fire({
        title: "Oops!",
        text: "You cannot add anymore amount because it reaches the category limit",
        icon: "warning",
      });
      return;
    }

    if (categoryTotalAmount + amount > categoryLimit) {
      Swal.fire({
        title: "Oops!",
        text: "You cannot add this amount because it exceeds the category limit",
        icon: "warning",
      });
      return;
    }

    apiService
      .post(`expense`, {
        description,
        date,
        category_id,
        amount,
      })
      .done(() => {
        hideLoader();
        Swal.fire({
          position: "center",
          icon: "success",
          title:
            "Your expense has been added, you will be redirected to dashboard",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1500);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          window.location.href = "../auth/login.html";
        } else if (jqXHR.status !== 401) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "We couldn't fetch data. Please try again later",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    hideLoader();
  });

  fetchCategories();
});
