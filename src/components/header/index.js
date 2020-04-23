import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Header = () => (

	<header class="">
		<div class="container">
			<div class="row">
			&nbsp;
			</div>
		</div>
	
		<div class="container">
			<div class="jumbotron">
				<Link href="/"><h1>Joe Mondragon</h1></Link>
				<p>
					<nav>
						<Link activeClassName={style.active} href="/blogs">Blogs</Link>
						<Link activeClassName={style.active} href="/contact">Contact me</Link>
					</nav>
				</p>
			</div>
		</div>
	</header>

);

export default Header;
