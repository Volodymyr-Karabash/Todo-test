import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash, Edit } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

export default function App() {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);
	const [editOpened, setEditOpened] = useState(false);
	const [editIndex, setEditIndex] = useState(null);
	const [editValues, setEditValues] = useState({ title: '', summary: '' });

	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const taskTitle = useRef('');
	const taskSummary = useRef('');

	function createTask() {
		setTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
			},
		]);

		saveTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
			},
		]);
	}

	function deleteTask(index) {
		var clonedTasks = [...tasks];

		clonedTasks.splice(index, 1);

		setTasks(clonedTasks);

		saveTasks([...clonedTasks]);
	}

	function editTask(index) {
		const task = tasks[index];
		setEditValues({ title: task.title, summary: task.summary });
		setEditIndex(index);
		setEditOpened(true);
	}

	function saveEditTask() {
		const updatedTasks = [...tasks];
		updatedTasks[editIndex] = editValues;
		setTasks(updatedTasks);
		saveTasks(updatedTasks);
		setEditOpened(false);
	}

	function loadTasks() {
		let loadedTasks = localStorage.getItem('tasks');

		let tasks = JSON.parse(loadedTasks);

		if (tasks) {
			setTasks(tasks);
		}
	}

	function saveTasks(tasks) {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	useEffect(() => {
		loadTasks();
	}, []);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				theme={{ colorScheme, defaultRadius: 'md' }}
				withGlobalStyles
				withNormalizeCSS>
				<div className='App'>
					<Modal
						opened={opened}
						size={'md'}
						title={'New Task'}
						withCloseButton={false}
						onClose={() => {
							setOpened(false);
						}}
						centered>
						<TextInput
							mt={'md'}
							ref={taskTitle}
							placeholder={'Task Title'}
							required
							label={'Title'}
						/>
						<TextInput
							ref={taskSummary}
							mt={'md'}
							placeholder={'Task Summary'}
							label={'Summary'}
						/>
						<Group mt={'md'} position={'apart'}>
							<Button
								onClick={() => {
									setOpened(false);
								}}
								variant={'subtle'}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									createTask();
									setOpened(false);
								}}>
								Create Task
							</Button>
						</Group>
					</Modal>
					<Container size={550} my={40}>
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								My Tasks
							</Title>
							<ActionIcon
								color={'blue'}
								onClick={() => toggleColorScheme()}
								size='lg'>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
						{tasks.length > 0 ? (
							tasks.map((task, index) => {
								if (!task.title) return null;

								return (
								<Card withBorder key={index} mt={'sm'}>
									<Group position={'apart'}>
									<Text weight={'bold'}>{task.title}</Text>
									<div style={{ display: 'flex' }}>
										<ActionIcon
										onClick={() => {
											editTask(index);
										}}
										color={'green'}
										variant={'transparent'}>
										<Edit />
										</ActionIcon>
										<ActionIcon
										onClick={() => {
											deleteTask(index);
										}}
										color={'red'}
										variant={'transparent'}>
										<Trash />
										</ActionIcon>
									</div>
									</Group>
									<Text color={'dimmed'} size={'md'} mt={'sm'}>
									{task.summary || 'No summary was provided for this task'}
									</Text>
								</Card>
								);
							})
							) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								You have no tasks
							</Text>
						)}
						<Button
							onClick={() => {
								setOpened(true);
							}}
							fullWidth
							mt={'md'}>
							New Task
						</Button>
					</Container>
				</div>
			</MantineProvider>
			<Modal
				opened={editOpened}
				size={'md'}
				title={'Edit Task'}
				withCloseButton={false}
				onClose={() => setEditOpened(false)}
				centered>
				<TextInput
					mt={'md'}
					value={editValues.title}
					onChange={e => setEditValues({ ...editValues, title: e.target.value })}
					placeholder='Task Title'
					required
					label='Title'
				/>
				<TextInput
					mt={'md'}
					value={editValues.summary}
					onChange={e => setEditValues({ ...editValues, summary: e.target.value })}
					placeholder='Task Summary'
					label='Summary'
				/>
				<Group mt={'md'} position='apart'>
					<Button variant='subtle' onClick={() => setEditOpened(false)}>
						Cancel
					</Button>
					<Button onClick={saveEditTask}>
						Save Changes
					</Button>
				</Group>
			</Modal>
		</ColorSchemeProvider>
	);
}
