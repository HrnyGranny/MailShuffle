<template>
    <div class="error-page">
      <b-container>
        <div class="errorContainer">
          <h1 class="errorCode">404</h1>
          <p class="errorInfo">
            Oops, it seems that this page does not exist.
          </p>
          <router-link class="mt-3 d-block" to="/">
            <MaterialButton
            variant="gradient"
            size="md"
            :style="{
              backgroundColor: '#98FE98',
              borderColor: '#98FE98',
              color: '#344767',
              'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
            }"
            class="btn btn-primary errorBtn"
          >
            <span>To main page</span>
          </MaterialButton>
          </router-link>
        </div>
        <footer class="pageFooter">
          © {{ new Date().getFullYear() }}, made by
                <a
                  href="https://github.com/HrnyGranny"
                  class="font-weight-bold"
                  target="_blank"
                  >HrnyGranny</a
                >
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
  
      &:hover {
        transform: scale(1.1);
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