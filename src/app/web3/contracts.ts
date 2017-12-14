export const TestContract = {
	'contractName': 'TestContract',
	'abi': [
		{
			'constant': false,
			'inputs': [
				{
					'name': 'key',
					'type': 'uint256'
				},
				{
					'name': 'value',
					'type': 'uint256'
				}
			],
			'name': 'setInt',
			'outputs': [],
			'payable': false,
			'stateMutability': 'nonpayable',
			'type': 'function'
		}
	],
	// tslint:disable-next-line:max-line-length
	'bytecode': '0x60606040523415600e57600080fd5b60b48061001c6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806347beafad146044575b600080fd5b3415604e57600080fd5b606b6004808035906020019091908035906020019091905050606d565b005b806000808481526020019081526020016000208190555050505600a165627a7a72305820890aa922f2e12f2cac4f10f418d4ee4d471054653521c5a5b6fa987b29fbd04f0029',
	'deployedBytecode': '0x606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806347beafad146044575b600080fd5b3415604e57600080fd5b606b6004808035906020019091908035906020019091905050606d565b005b806000808481526020019081526020016000208190555050505600a165627a7a72305820890aa922f2e12f2cac4f10f418d4ee4d471054653521c5a5b6fa987b29fbd04f0029',
	'sourceMap': '26:140:0:-;;;;;;;;;;;;;;;;;',
	// tslint:disable-next-line:max-line-length
	'deployedSourceMap': '26:140:0:-;;;;;;;;;;;;;;;;;;;;;;;;92:72;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;152:5;140:4;:9;145:3;140:9;;;;;;;;;;;:17;;;;92:72;;:::o',
	'source': 'pragma solidity ^0.4.18;\n\ncontract TestContract {\n\n    mapping(uint => uint) ints;\n    \n    function setInt(uint key, uint value) {\n        ints[key] = value;\n    }\n}',
	'sourcePath': '/Users/georgispasov/Development/Propy/testcontract/contracts/TestContract.sol',
	'ast': {
		'attributes': {
			'absolutePath': '/Users/georgispasov/Development/Propy/testcontract/contracts/TestContract.sol',
			'exportedSymbols': {
				'TestContract': [
					20
				]
			}
		},
		'children': [
			{
				'attributes': {
					'literals': [
						'solidity',
						'^',
						'0.4',
						'.18'
					]
				},
				'id': 1,
				'name': 'PragmaDirective',
				'src': '0:24:0'
			},
			{
				'attributes': {
					'baseContracts': [
						null
					],
					'contractDependencies': [
						null
					],
					'contractKind': 'contract',
					'documentation': null,
					'fullyImplemented': true,
					'linearizedBaseContracts': [
						20
					],
					'name': 'TestContract',
					'scope': 21
				},
				'children': [
					{
						'attributes': {
							'constant': false,
							'name': 'ints',
							'scope': 20,
							'stateVariable': true,
							'storageLocation': 'default',
							'type': 'mapping(uint256 => uint256)',
							'value': null,
							'visibility': 'internal'
						},
						'children': [
							{
								'attributes': {
									'type': 'mapping(uint256 => uint256)'
								},
								'children': [
									{
										'attributes': {
											'name': 'uint',
											'type': 'uint256'
										},
										'id': 2,
										'name': 'ElementaryTypeName',
										'src': '63:4:0'
									},
									{
										'attributes': {
											'name': 'uint',
											'type': 'uint256'
										},
										'id': 3,
										'name': 'ElementaryTypeName',
										'src': '71:4:0'
									}
								],
								'id': 4,
								'name': 'Mapping',
								'src': '55:21:0'
							}
						],
						'id': 5,
						'name': 'VariableDeclaration',
						'src': '55:26:0'
					},
					{
						'attributes': {
							'constant': false,
							'implemented': true,
							'isConstructor': false,
							'modifiers': [
								null
							],
							'name': 'setInt',
							'payable': false,
							'scope': 20,
							'stateMutability': 'nonpayable',
							'superFunction': null,
							'visibility': 'public'
						},
						'children': [
							{
								'children': [
									{
										'attributes': {
											'constant': false,
											'name': 'key',
											'scope': 19,
											'stateVariable': false,
											'storageLocation': 'default',
											'type': 'uint256',
											'value': null,
											'visibility': 'internal'
										},
										'children': [
											{
												'attributes': {
													'name': 'uint',
													'type': 'uint256'
												},
												'id': 6,
												'name': 'ElementaryTypeName',
												'src': '108:4:0'
											}
										],
										'id': 7,
										'name': 'VariableDeclaration',
										'src': '108:8:0'
									},
									{
										'attributes': {
											'constant': false,
											'name': 'value',
											'scope': 19,
											'stateVariable': false,
											'storageLocation': 'default',
											'type': 'uint256',
											'value': null,
											'visibility': 'internal'
										},
										'children': [
											{
												'attributes': {
													'name': 'uint',
													'type': 'uint256'
												},
												'id': 8,
												'name': 'ElementaryTypeName',
												'src': '118:4:0'
											}
										],
										'id': 9,
										'name': 'VariableDeclaration',
										'src': '118:10:0'
									}
								],
								'id': 10,
								'name': 'ParameterList',
								'src': '107:22:0'
							},
							{
								'attributes': {
									'parameters': [
										null
									]
								},
								'children': [],
								'id': 11,
								'name': 'ParameterList',
								'src': '130:0:0'
							},
							{
								'children': [
									{
										'children': [
											{
												'attributes': {
													'argumentTypes': null,
													'isConstant': false,
													'isLValue': false,
													'isPure': false,
													'lValueRequested': false,
													'operator': '=',
													'type': 'uint256'
												},
												'children': [
													{
														'attributes': {
															'argumentTypes': null,
															'isConstant': false,
															'isLValue': true,
															'isPure': false,
															'lValueRequested': true,
															'type': 'uint256'
														},
														'children': [
															{
																'attributes': {
																	'argumentTypes': null,
																	'overloadedDeclarations': [
																		null
																	],
																	'referencedDeclaration': 5,
																	'type': 'mapping(uint256 => uint256)',
																	'value': 'ints'
																},
																'id': 12,
																'name': 'Identifier',
																'src': '140:4:0'
															},
															{
																'attributes': {
																	'argumentTypes': null,
																	'overloadedDeclarations': [
																		null
																	],
																	'referencedDeclaration': 7,
																	'type': 'uint256',
																	'value': 'key'
																},
																'id': 13,
																'name': 'Identifier',
																'src': '145:3:0'
															}
														],
														'id': 14,
														'name': 'IndexAccess',
														'src': '140:9:0'
													},
													{
														'attributes': {
															'argumentTypes': null,
															'overloadedDeclarations': [
																null
															],
															'referencedDeclaration': 9,
															'type': 'uint256',
															'value': 'value'
														},
														'id': 15,
														'name': 'Identifier',
														'src': '152:5:0'
													}
												],
												'id': 16,
												'name': 'Assignment',
												'src': '140:17:0'
											}
										],
										'id': 17,
										'name': 'ExpressionStatement',
										'src': '140:17:0'
									}
								],
								'id': 18,
								'name': 'Block',
								'src': '130:34:0'
							}
						],
						'id': 19,
						'name': 'FunctionDefinition',
						'src': '92:72:0'
					}
				],
				'id': 20,
				'name': 'ContractDefinition',
				'src': '26:140:0'
			}
		],
		'id': 21,
		'name': 'SourceUnit',
		'src': '0:166:0'
	},
	'compiler': {
		'name': 'solc',
		'version': '0.4.18+commit.9cf6e910.Emscripten.clang'
	},
	'networks': {},
	'schemaVersion': '1.0.1',
	'updatedAt': '2017-12-13T18:04:54.996Z'
};
