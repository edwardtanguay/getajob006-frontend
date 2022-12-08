import { useContext } from 'react';
import { AppContext } from '../appContext';

export const PageDashboard = () => {
	const { todos } = useContext(AppContext);
	return (
		<div className="page pageDashboard">
			<h2>Todos</h2>
			<div className="todos">
				{todos.map((todo, i) => {
					return (
						<ul className="todo" key={i}>
							<li>{todo.todoText}: <a target="_blank" href={todo.url}>{todo.title} at {todo.company}</a></li>
						</ul>
					);
				})}
			</div>
		</div>
	);
};
