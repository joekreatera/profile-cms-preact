import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Header = () => (

	<header class="">

	<div class="container">
		<div class="row">
				&nbsp;
		</div>

		<div class="jumbotron">
					<h1>Welcome to the projects showcase</h1>
					<p>
						<nav>
							<a class="btn btn-info" target="_self" href="https://joe.videogamesacademy.com">Back</a>
							<br/>
							<Link activeClassName={style.active} href="/contact">Contact me</Link>
						</nav>
					</p>
		</div>

	</div>

	</header>

);

export default Header;
