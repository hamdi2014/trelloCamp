const bar = () => console.log('bar')

const baz = () => console.log('baz')

const foo = async() => {
  console.log('foo')
  await new Promise((res,rej)=>{
    setTimeout(()=>{
        bar();
        res();
    },1000)
  })
  baz()
}

foo()