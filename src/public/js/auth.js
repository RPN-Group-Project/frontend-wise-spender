const BASE_URL = "https://backend-wise-spender.vercel.app";
const loginUrl = `${BASE_URL}/v1/auth/login`;
const registerUrl = `${BASE_URL}/v1/auth/register`;

$(document).ready(function () {
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();

    var email = $("#email").val();
    var password = $("#password").val();

    if (!email || !password || password.length < 6) {
      showError(
        "Please enter a valid email address and ensure the password is at least 6 characters long."
      );
      return;
    }

    // Send AJAX request
    $.ajax({
      url: loginUrl,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email: email, password: password }),
      success: function (response) {
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("userId", response.user.id);
        localStorage.setItem("token", response.tokens.access.token);
        $(".loading-overlay").show();

        if (localStorage.getItem("newUser") === "true") {
          // Redirect to the onboarding page
          setTimeout(function () {
            window.location.href = "../onboard/onboard.html";
          }, 2000);
        } else {
          // Redirect to the dashboard or main application
          setTimeout(function () {
            window.location.href = "../index.html";
          }, 2000);
        }
      },
      error: function (xhr) {
        const errorMsg =
          xhr.responseJSON && xhr.responseJSON.message
            ? xhr.responseJSON.message
            : "An unknown error occurred.";
        showError("Login failed: " + errorMsg);
      },
    });
  });

  $("#registerForm").on("submit", function (event) {
    event.preventDefault();

    var name = $("#name").val();
    var email = $("#email").val();
    var password = $("#password").val();

    if (!email || !password || password.length < 6) {
      showError(
        "Please enter a valid email address and ensure the password is at least 6 characters long."
      );
      return;
    }
    if (!name) {
      showError("Please fill in all required fields.");
      return;
    }

    $.ajax({
      url: registerUrl,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ name: name, email: email, password: password }),
      success: function (response) {
        localStorage.setItem("newUser", "true");
        $(".loading-overlay").show();
        setTimeout(function () {
          window.location.href = "./login.html";
        }, 2000);
      },
      error: function (xhr) {
        const errorMsg =
          xhr.responseJSON && xhr.responseJSON.message
            ? xhr.responseJSON.message
            : "An unknown error occurred.";
        showError("Registration failed: " + errorMsg);
      },
    });
  });
  function showError(message) {
    $("#error-text").text(message);
    $("#error-message").removeClass("hidden").addClass("block");
  }
  function showSuccess(message) {
    $("#success-text").text(message);
    $("#success-message").removeClass("hidden").addClass("block");
  }
});
