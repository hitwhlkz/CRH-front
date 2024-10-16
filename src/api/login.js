import instance from './request'

function login() {
  return new Promise((resolve, reject) => {
    instance('/login/doLogin').then(res=> {
      if (res.code === 200) {
        resolve(res)
      }
    }).catch(error =>{
      reject(error)
    })
  })
}

export {login}
