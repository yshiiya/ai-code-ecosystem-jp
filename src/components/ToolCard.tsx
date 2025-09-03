import Link from "next/link";

interface Tool {
	id: string;
	name: string;
	category: string;
	description: string;
	pricing: string;
	tags: string[];
}

interface ToolCardProps {
	tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
	return (
		<Link
			href={`/tools/${tool.id}`}
			className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition"
		>
			<div className="flex justify-between items-start mb-3">
				<h3 className="text-xl font-semibold">{tool.name}</h3>
				<span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
					{tool.category}
				</span>
			</div>

			<p className="text-gray-700 mb-3 line-clamp-2">{tool.description}</p>

			<div className="flex justify-between items-center">
				<span className="text-sm font-medium text-gray-600">
					{tool.pricing}
				</span>
				<div className="flex gap-1">
					{tool.tags.slice(0, 2).map((tag) => (
						<span
							key={tag}
							className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</Link>
	);
};

export default ToolCard;
