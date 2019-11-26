import { withRouter } from 'next/router';

function Main(props) {
    console.info(props.router.query);
    return (
        <div>This is the main</div>
    );
}

export default withRouter(Main);