import { useState, useEffect } from 'react';
import { createContext } from 'react';
import axios from 'axios';
import { Job, Todo, TotaledSkill } from './types';

interface IAppContext {
	jobs: Job[];
	todos: Todo[];
	totaledSkills: TotaledSkill[];
	handleToggleTotaledSkill: (totaledSkill: TotaledSkill) => void;
}

interface IAppProvider {
	children: React.ReactNode;
}

const backendUrl = 'http://localhost:3011';
export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [totaledSkills, setTotaledSkills] = useState<TotaledSkill[]>([]);

	useEffect(() => {
		(async () => {
			setJobs((await axios.get(`${backendUrl}/jobs`)).data);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const _todos = (await axios.get(`${backendUrl}/todos`)).data;
			_todos.sort((a: Todo, b: Todo) => a.todoText > b.todoText);
			setTodos(_todos);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const _totaledSkills: TotaledSkill[] = (
				await axios.get(`${backendUrl}/totaledSkills`)
			).data;
			_totaledSkills.sort(
				(a: TotaledSkill, b: TotaledSkill) =>
					Number(b.total) - Number(a.total)
			);
			_totaledSkills.forEach((_totaledSkill) => {
				_totaledSkill.isOpen = false;
				if (_totaledSkill.skill.name) {
					_totaledSkill.lookupInfoLink = `https://www.google.com/search?client=firefox-b-d&q=web+development+${_totaledSkill.skill.name}`;
				} else {
					_totaledSkill.lookupInfoLink = `https://www.google.com/search?client=firefox-b-d&q=web+development+${_totaledSkill.skill.idCode}`;
				}
			});
			setTotaledSkills(_totaledSkills);
		})();
	}, []);

	const handleToggleTotaledSkill = (totaledSkill: TotaledSkill) => {
		totaledSkill.isOpen = !totaledSkill.isOpen;
		setTotaledSkills([...totaledSkills]);
	};
	return (
		<AppContext.Provider
			value={{
				jobs,
				todos,
				totaledSkills,
				handleToggleTotaledSkill,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
