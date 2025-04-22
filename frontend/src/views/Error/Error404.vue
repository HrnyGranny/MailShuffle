<template>
    <div class="error-page">
      <b-container>
        <div class="errorContainer">
          <h1 class="errorCode">404</h1>
          <p class="errorInfo">
            Oops, it seems that this page does not exist.
          </p>
          <router-link class="mt-3 d-block" to="/">
            <button class="btn btn-primary" type="button">
              To main page
            </button>
          </router-link>
        </div>
        <footer class="pageFooter">
          2025 &copy; MailShuffle. All rights reserved.
        </footer>
      </b-container>
    </div>
  </template>
  
  <script>
  export default {
    name: "ErrorPage",
  };
  </script>
  
  <style lang="scss" scoped>
  .error-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f0f2f5; /* Fondo igual que la página principal */
    height: 100vh;
  
    .errorContainer {
      text-align: center;
    }
  
    .errorCode {
      margin: 20px 0;
      font-size: 200px; /* Texto más grande */
      font-weight: bold;
    }
  
    .errorInfo {
      font-size: 20px;
    }
  
    .errorBtn {
      background-color: #98fe98; /* Color verde */
      border-color: #98fe98; /* Borde verde */
      color: #344767; /* Texto oscuro */
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
  
      &:hover {
        background-color: #7edc7e; /* Color más oscuro al pasar el cursor */
      }
    }
  
    .pageFooter {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
      width: 100%;
      font-size: 12px;
      color: #6c757d;
      text-align: center;
    }
  }
  </style>