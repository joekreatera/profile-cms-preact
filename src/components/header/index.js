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
							<Link activeClassName={style.active} href="http://joe.videogamesacademy.com">Back</Link>
							|
							<Link activeClassName={style.active} href="/contact">Contact me</Link>
						</nav>
					</p>
		</div>

	</div>

	</header>

);

export default Header;
