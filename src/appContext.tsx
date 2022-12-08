import { useState, useEffect } from 'react';
import { createContext } from 'react';
import axios from 'axios';
import { Job, Todo, TotaledSkill } from './types';

interface IAppContext {
	jobs: Job[];
	todos: Todo[];
	totaledSkills: TotaledSkill[];
	handleToggleTotaledSkill: (totaledSkill: TotaledSkill) => void;
	handleDeleteJob: (job: Job) => void;
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

	const loadJobs = async () => {
		setJobs((await axios.get(`${backendUrl}/jobs`)).data);
	};
	const loadTodos = async () => {
		(async () => {
			const _todos = (await axios.get(`${backendUrl}/todos`)).data;
			_todos.sort((a: Todo, b: Todo) => a.todoText > b.todoText);
			setTodos(_todos);
		})();
	};
	const loadTotaledSkills = async () => {
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
			await loadTotaledSkills();
		})();
	}, []);

	const handleToggleTotaledSkill = (totaledSkill: TotaledSkill) => {
		totaledSkill.isOpen = !totaledSkill.isOpen;
		setTotaledSkills([...totaledSkills]);
	};

	const handleDeleteJob = async (job: Job) => {
		try {
			const res = await axios.delete(`${backendUrl}/jobs/${job.id}`);
			if ((res.status = 200)) {
				await loadJobs();
				await loadTodos();
				await loadTotaledSkills();
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
				totaledSkills,
				handleToggleTotaledSkill,
				handleDeleteJob,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
