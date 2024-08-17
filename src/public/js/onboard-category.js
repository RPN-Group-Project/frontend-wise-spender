import numberFormat from "./utils/numberFormat.js";

const BASE_URL = "https://backend-wise-spender.vercel.app";
const userUrl = `${BASE_URL}/v1/users/`;
const categoryUrl = `${BASE_URL}/v1/category/`;

$(document).ready(function () {
  // auto redirect to login if no token detected'
  if (!localStorage.getItem("token")) {
    window.location.href = "./auth/login.html";
  }

  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("token");
  $.ajax({
    url: `${userUrl}${userId}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`, // Include auth token
    },
    success: function (response) {
      var expenseLimit = response.data.expense_limit;
      var targetExpense = $("#target-expense");
      targetExpense.html(`
                    ${numberFormat(expenseLimit)}
                `);
    },
    error: function () {
      showError("Error fetching target expense");
    },
  });

  $.ajax({
    url: `${userUrl}${userId}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`, // Include auth token
    },
    success: function (response) {
      var category = response.data.category;
      var tableCategory = $("#table-category");
      if (category.length === 0) {
        tableCategory.html(`
                             <table class="w-full text-sm text-left text-gray-500 ">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">
                                            Please
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Add
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Category
                                        </th>
                                    </tr>
                                </thead>
                
                             </table>
                       `);
      } else {
        let categoryRows = category
          .map(
            (cat) => `
                            <tr class="bg-white border-b hover:bg-gray-50 ">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    ${cat.name}
                                </th>
                                <td class="px-6 py-4">
                                    ${numberFormat(cat.monthly_budget)}
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="#" style="color: #ffcc00;" class="mr-2 font-medium hover:underline">Edit</a>
                                    <a href="#" style="color: #f87171;" class="font-medium hover:underline">Delete</a>
                                </td>
                            </tr>
                        `
          )
          .join("");
        tableCategory.html(`
                            <table class="w-full text-sm text-left text-gray-500 ">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">
                                            Name
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Allocation
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${categoryRows}
                                </tbody>
                            </table>
                        `);
      }
    },
    error: function () {
      showError("Error fetching target expense");
    },
  });

  // post category
  $("#categoryForm").on("submit", function (event) {
    event.preventDefault();

    var name = $("#category").val();
    var monthlyBudget = $("#monthlyBudget").val();

    $.ajax({
      url: `${categoryUrl}`,
      type: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: JSON.stringify({ name: name, monthly_budget: monthlyBudget }),
      success: function (response) {
        $(".loading-overlay").show();
        location.reload();
      },
      error: function (xhr) {
        const errorMsg =
          xhr.responseJSON && xhr.responseJSON.message
            ? xhr.responseJSON.message
            : "An unknown error occurred.";
        showError("Add category failed: " + errorMsg);
      },
    });
  });

  $("#continueButton").on("click", function () {
    localStorage.removeItem("newUser");
    $(".loading-overlay").show();
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 2000);
  });

  function showError(message) {
    $("#error-text").text(message);
    $("#error-message").removeClass("hidden").addClass("block");
  }
});
