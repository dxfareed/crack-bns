/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

/* const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  
  title: 'Frog Frame',
}) */

type State = {   
  count: string[]
}


const app = new Frog<{ State: State}>(
  {
  assetsPath: '/',
  basePath: '/api',
  title:'BNS Check',
  initialState: {
    count: ["user"]
  }
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
 /*  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue */
  return c.res({
    action:'/start',
    image: (
      <div
      style={{
        display:'flex',
        width:'100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems:'center',
        position:'relative',
        backgroundColor:'blue',
      }}
      >
        <div
                style={{
                    position: 'absolute',
                    margin:0,
                    top:180,
                    width:600,
                    left:150,
                    wordWrap:'break-word',
                    overflowWrap:'break-word',
                    color:'white',
                    lineHeight: 1,
                    fontSize:55,
                    fontFamily:"monospace",
                    fontWeight:900,
                }}
                >
                   Check the list of Basename(s) an address own 🤓
                </div>
      </div>
    ),
    intents: [
      <Button value="start">Start</Button>,
    ],
  })
})

app.frame('/start', (c)=>{
  //const {status} = c;
  return c.res({
    action:'/search',
    image:(
      <div
        style={{
          display:'flex',
          fontSize:105,
          width:'100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems:'center',
          backgroundColor:'blue',
        }}
      >
        👀
      </div>
    ),
    intents:[
      <TextInput placeholder='otedola.base.eth'/>,
      <Button value='search'>Search🔎</Button>
    ]
  })
})

app.frame('/search', async (c)=>{
  const {inputText, deriveState, buttonValue} = c;
  const fetchdata = await fetch(`https://fetch-api-mauve-iota.vercel.app/api/${inputText}`)
  .then((r)=>{
  return r.json()
  }).then((data)=> {
    return {data, num: data.length}
  })
  .catch(()=> {return "error"});

  

  const state = deriveState(previousState => {
    if (buttonValue === 'search'){
      if(fetchdata !== "error"){
        //@ts-ignore
        previousState.count = fetchdata.data.map((r, index)=> {
          return(
          <li key={index} 
          style={{
              marginBottom: '2px',
              fontSize: '30px',
              fontWeight:'900', 
              wordBreak: 'break-word'
          }} >{r}</li>)});
          //@ts-ignore
          console.log(fetchdata.num);
      }
      else{
        previousState.count = ["user found"];
      }
      //console.log(fetchdata);

    }
  })
  //console.log(state.count);
  return c.res({
    action:"/",
    image:(
    <div 
    style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: 'blue',
      color:'white',
      flexDirection:'column',
      alignItems:"flex-start",
      justifyContent:'flex-start',
      fontSize:'40px',
      position:'relative',
  }}
    >
     {fetchdata !== "error" ? <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'blue',
                    color:'white', 
                    flexDirection:'column',
                    alignItems:"flex-start",
                    justifyContent:'flex-start',
                    fontSize:'40px',
                    position:'relative',
                }}
            >
               <div
                 style={{
                    display: 'flex',
                    marginTop:"50px",
                    textAlign:'center',
                    justifyContent:'center',
                    fontWeight:'900',
                }}
               ><div
                    style={{
                        display:"flex",
                        textTransform:"capitalize",
                        marginRight:"5px",
                        marginLeft:"5px",
                        fontWeight:'900',
                        
                    }}
               > {inputText?.split(".")[0]}
               </div> own {
               //@ts-ignore
               fetchdata.num} basename(s)</div>
                <ol
                   style={{
                        display:'flex',
                        flexDirection:'column',
                        gap:'10px',
                        fontSize:'30px',
                        fontWeight:900,
                        justifyContent:"flex-start",
                        textAlign:"left",
                        position:"absolute",
                        top:120,
                        left:10,
                        height:'500px',
                        flexWrap:'wrap'
                    }}
                >
                    {state.count}
                </ol>
      </div> : <div>This user does not exist!</div>  }
    </div>
    ),
    intents:[
      <Button>Restart</Button>
    ]
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
