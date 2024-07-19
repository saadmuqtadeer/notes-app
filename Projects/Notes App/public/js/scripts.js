$(document).ready(function () {
  // Login form submission
  $("#login-form").on("submit", function (event) {
    event.preventDefault();

    const email = $("#login-email").val();
    const password = $("#login-password").val();

    $.ajax({
      url: "/api/v1/auth/login",
      method: "POST",
      data: { email, password },
      success: function (response) {
        $("#login-message").text(response.message);
        if (response.success) {
          localStorage.setItem("token", response.token);
          setTimeout(() => (window.location.href = "notes.html"), 2000);
        }
      },
      error: function () {
        $("#login-message").text("Error logging in");
      },
    });
  });

  // Register form submission
  $("#register-form").on("submit", function (event) {
    event.preventDefault();

    const name = $("#register-name").val();
    const email = $("#register-email").val();
    const password = $("#register-password").val();
    const phone = $("#register-phone").val();

    $.ajax({
      url: "/api/v1/auth/register",
      method: "POST",
      data: { name, email, password, phone },
      success: function (response) {
        $("#register-message").text(response.message);
        if (response.success) {
          $("#register-form")[0].reset();
          setTimeout(() => (window.location.href = "index.html"), 2000);
        }
      },
      error: function () {
        $("#register-message").text("Error registering user");
      },
    });
  });

  function fetchNotes() {
    $.ajax({
      url: "/api/v1/notes",
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      success: function (response) {
        $("#notes-list").empty();
        response.userNotes.forEach((note) => {
          $("#notes-list").append(`
            <div class="note">
              <h3>${note.title}</h3>
              <p>${note.description}</p>
              <button class="edit-note-btn" data-id="${note._id}">Edit</button>
              <button class="delete-note-btn" data-id="${note._id}">Delete</button>
            </div>
          `);
        });
      },
      error: function () {
        alert("Error fetching notes");
      },
    });
  }

  // Create note button
  $("#create-note-btn").on("click", function () {
    $("#note-form").toggle();
    $("#note-form-content")[0].reset();
    $("#form-title").text("Create Note");
    $("#note-form-content").removeData("id"); // Remove data-id for new note
  });

  // Note form submission
  $("#note-form-content").on("submit", function (event) {
    event.preventDefault();

    const title = $("#note-title").val();
    const description = $("#note-description").val();
    const noteId = $("#note-form-content").data("id");

    const url = noteId
      ? `/api/v1/notes/update/${noteId}`
      : "/api/v1/notes/create";
    const method = noteId ? "PUT" : "POST";

    $.ajax({
      url: url,
      method: method,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      data: { title, description },
      success: function () {
        $("#note-form").hide();
        fetchNotes();
      },
      error: function () {
        alert("Error saving note");
      },
    });
  });

  // Cancel button to hide the form
  $("#cancel-note-btn").on("click", function () {
    $("#note-form").hide();
    $("#note-form-content")[0].reset();
  });

  // Edit note button
  $(document).on("click", ".edit-note-btn", function () {
    const noteId = $(this).data("id");
    $.ajax({
      url: `/api/v1/notes/${noteId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      success: function (response) {
        $("#note-title").val(response.note.title);
        $("#note-description").val(response.note.description);
        $("#note-form-content").data("id", noteId);
        $("#note-form").show();
        $("#form-title").text("Edit Note");
      },
      error: function () {
        alert("Error fetching note");
      },
    });
  });

  // Delete note button
  $(document).on("click", ".delete-note-btn", function () {
    const noteId = $(this).data("id");
    $.ajax({
      url: `/api/v1/notes/delete/${noteId}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      success: function () {
        fetchNotes();
      },
      error: function () {
        alert("Error deleting note");
      },
    });
  });

  // Initialize notes page
  if (window.location.pathname.endsWith("notes.html")) {
    fetchNotes();
  }
});
