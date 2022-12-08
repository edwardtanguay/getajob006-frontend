import { useContext } from 'react';
import { AppContext } from '../appContext';

export const PageSkills = () => {
	const { totaledSkills, handleToggleTotaledSkill } = useContext(AppContext);
	return (
		<div className="page pageSkills">
			<h2>Skills</h2>
			<div className="totaledSkills">
				{totaledSkills.map((totaledSkill, i) => {
					return (
						<div key={i}
							className={`totaledSkill ${
								totaledSkill.skill.name ? 'found' : 'missing'
							}`}
						>
							<div className="mainArea" onClick={() => handleToggleTotaledSkill(totaledSkill)}>
								<span className="total">
									{totaledSkill.total}x
								</span>{' '}
								{totaledSkill.skill.name ? (
									<span className="name">
										{totaledSkill.skill.name}
									</span>
								) : (
									<span className="name">
										{totaledSkill.skill.idCode}
									</span>
								)}
							</div>
							{totaledSkill.isOpen && (
								<div className="openArea">
									{totaledSkill.skill.name ? (
										<div className="description">
											{totaledSkill.skill.description}{' '}
												<a
													href={
														totaledSkill.skill.url
													}
													target="_blank"
												>
													info
												</a>{' '}
												<a
													href={
														totaledSkill.lookupInfoLink
													}
													target="_blank"
												>
													lookup
												</a>
										</div>
									) : (
										<div className="description">
											create new entry in backend:
											<br />
											\src\data\skillInfos.json
											<br />
											<a
												href={
													totaledSkill.lookupInfoLink
												}
												target="_blank"
											>
												lookup
											</a>
										</div>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
