import { useState, useEffect } from 'react';
import { createContext } from 'react';
import axios from 'axios';
import { IJob, ITodo, ISkillTotal } from './interfaces';

interface IAppContext {
	jobs: IJob[];
	todos: ITodo[];
	skillTotals: ISkillTotal[];
	handleToggleSkillTotal: (skillTotal: ISkillTotal) => void;
	handleDeleteJob: (job: IJob) => void;
}

interface IAppProvider {
	children: React.ReactNode;
}

const backendUrl = 'http://localhost:3011';
export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
	const [jobs, setJobs] = useState<IJob[]>([]);
	const [todos, setTodos] = useState<ITodo[]>([]);
	const [skillTotals, setSkillTotals] = useState<ISkillTotal[]>([]);

	const loadJobs = async () => {
		setJobs((await axios.get(`${backendUrl}/jobs`)).data);
	};
	const loadTodos = async () => {
		(async () => {
			const _todos = (await axios.get(`${backendUrl}/todos`)).data;
			_todos.sort((a: ITodo, b: ITodo) => a.todoText > b.todoText);
			setTodos(_todos);
		})();
	};
	const loadSkillTotals = async () => {
		const _skillTotals: ISkillTotal[] = (
			await axios.get(`${backendUrl}/skillTotals`)
		).data;
		_skillTotals.sort(
			(a: ISkillTotal, b: ISkillTotal) => Number(b.total) - Number(a.total)
		);
		_skillTotals.forEach((_skillTotal) => {
			_skillTotal.isOpen = false;
			if (_skillTotal.skill.name) {
				_skillTotal.lookupInfoLink = `https://www.google.com/search?client=firefox-b-d&q=web+development+${_skillTotal.skill.name}`;
			} else {
				_skillTotal.lookupInfoLink = `https://www.google.com/search?client=firefox-b-d&q=web+development+${_skillTotal.skill.idCode}`;
			}
		});
		setSkillTotals(_skillTotals);
	};

	useEffect(() => {
		(async () => {
			await loadJobs();
		})();
	}, []);
	useEffect(() => {
		(async () => {
			await loadTodos();
		})();
	}, []);
	useEffect(() => {
		(async () => {
			await loadSkillTotals();
		})();
	}, []);

	const handleToggleSkillTotal = (skillTotal: ISkillTotal) => {
		skillTotal.isOpen = !skillTotal.isOpen;
		setSkillTotals([...skillTotals]);
	};

	const handleDeleteJob = async (job: IJob) => {
		try {
			const res = await axios.delete(`${backendUrl}/jobs/${job.id}`);
			if ((res.status = 200)) {
				await loadJobs();
				await loadTodos();
				await loadSkillTotals();
			} else {
				console.log(res);
			}
		} catch (e: any) {
			console.error(`ERROR: ${e.message}`);
			const message = e.response.data.message;
			if (message) {
				console.error(`ERROR: ${message}`);
			}
		}
	};

	return (
		<AppContext.Provider
			value={{
				jobs,
				todos,
				skillTotals: skillTotals,
				handleToggleSkillTotal: handleToggleSkillTotal,
				handleDeleteJob,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
