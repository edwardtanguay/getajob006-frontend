import { useContext } from 'react';
import { AppContext } from '../appContext';
import { Job, Skill } from '../types';

export const PageJobs = () => {
	const { jobs } = useContext(AppContext);

	return (
		<div className="page pageJobs">
			<div className="jobs">
				<h2>There are {jobs.length} jobs:</h2>
				{jobs.map((job: Job) => {
					return (
						<div className="job" key={job.id}>
							<div className="title">
								<a href={job.url} target="_blank">
									{job.title}
								</a>
							</div>
							<div className="company">{job.company}</div>
							<div className="todo">NEXT TASK: {job.todo}</div>
							<div className="description">{job.description}</div>
							<div className="skills">
								{job.skills.map((skill: Skill) => {
									return (
										<>
											{skill.name ? (
												<div className="skill found">
													<div className="name">
														<a href={skill.url} target="_blank">{skill.name}</a> - {skill.description}
													</div>
												</div>
											) : (
												<div className="skill missing">
													<div className="name">
														
														<a href={`https://www.google.com/search?q=${skill.idCode}+web+development`} target="_blank">{skill.idCode}</a> - ADD TO BACKEND: \src\data\skillInfos.json
													</div>
												</div>
											)}
										</>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
