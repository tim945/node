<template>
  <div class="hello">
    <p>
      {{ msg }}
    </p>
    <form ref="form" action="" @submit.prevent>
      姓名：<input type="text" name="username" v-model="userName" />
      <br />
      年龄：<input type="text" name="age" v-model="age" />
      <p>
        <button type="button" @click="addUser">提交信息</button>
      </p>
    </form>
    <p></p>
    <form action="" @submit.prevent>
      <input type="text" v-model="keywords" placeholder="输入姓名查询" />
      <button type="button" @click="selectUser">查询</button>
    </form>
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.id }}、{{ item.name }} - {{ item.age }}
        <button @click="del(item.id)">X</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      userName: "",
      age: "",
      keywords: "",
      list: [],
    };
  },
  methods: {
    reset() {
      this.userName = "";
      this.age = "";
    },
    addUser() {
      //添加用户
      let name = this.userName;
      let age = this.age;

      if (!name || !age) return;

      axios
        .post("/api/user/addUser", {
          name,
          age,
        })
        .then((res) => {
          this.reset();
          console.log("信息添加成功", res);
          this.selectUser();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    del(id) {
      axios
        .post("/api/user/delUser", {
          id,
        })
        .then((res) => {
          console.log("删除成功", res);
          this.selectUser();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectUser() {
      //查询用户
      let name = this.keywords;
      axios
        .post("/api/user/selectUser", {
          name,
        })
        .then((res) => {
          // let data = res.data[0];
          // this.userName = data.name;
          // this.age = data.age
          // this.list = res.data
          this.list = Object.freeze(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.selectUser();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  /* display: inline-block; */
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
