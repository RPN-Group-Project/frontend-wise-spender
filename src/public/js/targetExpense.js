const BASE_URL = "https://backend-wise-spender.vercel.app";
const userUrl = `${BASE_URL}/v1/users/`;

document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("token");

  document
    .getElementById("expense-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const expense = document.getElementById("expense").value;

      $.ajax({
        url: `${userUrl}${userId}`,
        type: "PATCH",
        contentType: "application/json",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: JSON.stringify({ expense_limit: expense }),
        success: function (response) {
          $(".loading-overlay").show();
          setTimeout(function () {
            window.location.href = "../index.html";
          }, 2000);
        },
        error: function (xhr) {
          const errorMsg =
            xhr.responseJSON && xhr.responseJSON.message
              ? xhr.responseJSON.message
              : "An unknown error occurred.";
          showError("Failed to update expense limit. " + errorMsg);
        },
      });
    });

  function showError(message) {
    $("#error-text").text(message);
    $("#error-message").removeClass("hidden").addClass("block");
  }
});
