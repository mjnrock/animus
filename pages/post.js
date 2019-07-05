import Layout from '../components/MyLayout.js';
import fetch from 'isomorphic-unfetch';

const Post = props => (
  <Layout>
	  <div>{props.time}</div>
    <h1>{props.show.name}</h1>
    <p>{props.show.summary.replace(/<[/]?p>/g, '')}</p>
    <img src={props.show.image.medium} />
  </Layout>
);

Post.getInitialProps = async function(context) {
  const { id, time } = context.query;
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  const show = await res.json();

  console.log(`Fetched show: ${show.name}`);

  return { show, time };
};

export default Post;
