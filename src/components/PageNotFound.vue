<template>
    <div class="login">
        <div class="login__form">
            <h1>:( PAGE NOT FOUND!</h1> <br>
            <p>The page that you're looking for is either under maintenance or not found!</p>
            <a style="text-decoration: underline;" @click="redirect('dashboard', { tenant: $route.params.tenant })">Go back</a>
        </div>
    </div>
</template>