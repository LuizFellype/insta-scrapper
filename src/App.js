import React from 'react';
import logo from './logo.svg';
import { Card } from 'primereact/card';
// import Tooltip from 'primereact/tooltip';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import copy from 'clipboard-copy';

import './App.css';

// const btnTooltip = { position: 'bottom', mouseTrack: true, mouseTrackTop: -10 }
const btnTooltip = { position: 'left', mouseTrack: true }
const defaultEdgeMediaToCaption = { edges: [{ node: { text: 'Não há descrição neste post.' } }] }
const feedbackMsg = { severity: 'success', summary: 'Copiado !!!', detail: 'O link e a descrição do post foram copiados.' }

const DATA_KEYS = {
  username: 'username',
  biography: 'biography',
  edge_owner_to_timeline_media: 'edge_owner_to_timeline_media',
  mediaDescription: 'mediaDescription'
}

const NODE_KEYS = {
  display_url: 'display_url',
  edge_media_to_caption: 'edge_media_to_caption'
}

const getMediaDescription = (edge_media_to_caption = defaultEdgeMediaToCaption) => {
  const { edges: [{ node: { text: mediaDescription } }] } = edge_media_to_caption

  return mediaDescription
}
const CardHeader = (props) => (<div className='header-wrapper'>
  <Button icon="pi pi-check" className='btn-over-image' tooltip={props.tooltipMsg} tooltipOptions={btnTooltip} onClick={props.onCopy} />

  <img alt="Card" src={props.imageUrl} width='50px' height='100px' data-pr-tooltip="PrimeReact-Logo" />
</div>
)


function App() {
  const [data, setData] = React.useState()
  const toastRef = React.useRef(null)

  React.useEffect(() => {
    fetch('https://www.instagram.com/proeja.ifes.vix/?__a=1').then(resp => resp.json()).then(d => {
      const { biography, edge_owner_to_timeline_media, username } = d.graphql.user



      const wholeData = { username, biography, edge_owner_to_timeline_media }
      console.log('DATA FETCHED: ', d)
      console.log('STATE DATA', wholeData)
      setData(wholeData)
    }).catch(err => console.log('EERRROOOOO: ', err))
  }, [])

  const posts = data && data[DATA_KEYS.edge_owner_to_timeline_media].edges

  return (
    <>
      <Growl ref={toastRef} />
      <div className="App">

        <header className="App-header" >
          {
            !!data ? <>
              <h1>{data[DATA_KEYS.username]}</h1>
              <h3>{data[DATA_KEYS.biography]}</h3>
              <div style={{ width: '90%', display: 'flex' }}>
                <span>Total de posts: {data[DATA_KEYS.edge_owner_to_timeline_media].count}</span>
              </div>
              <div style={{ width: '90%', display: 'flex' }}>
                <span>Sobre os ultimos 12 posts: </span>
              </div>

              <div className="cards-wrapper">
                {posts.map(({ node }) => {
                  const tooltipMsg = getMediaDescription(node[NODE_KEYS.edge_media_to_caption])
                  const postLink = `https://www.instagram.com/p/${node.shortcode}/`

                  return <div>
                    <Card header={<CardHeader
                      imageUrl={node[NODE_KEYS.display_url]}
                      tooltipMsg={tooltipMsg}
                      onCopy={() => {
                        copy([postLink, `\n\n${tooltipMsg}`])
                        toastRef.current.show(feedbackMsg)
                      }}
                    />}
                    >

                      <p>Num. de Curtidas: <b>{node.edge_media_preview_like.count}</b></p>
                      <p>Num. Comentários: <b>{node.edge_media_to_comment.count}</b></p>

                      <div className='p-d-flex p-justify-end'><a href={postLink} className="App-link" target="_blank" rel="noopener noreferrer">
                        Link do Post
              </a></div>
                    </Card>

                  </div>
                })}
              </div>
            </> : <>
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  LOADING ...
            </p>
              </>
          }
          {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        </header>
      </div>
    </>
  );
}

export default App;
