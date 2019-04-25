const expect = require('expect.js');

const parseTextCommand = require('./parseTextCommand');

describe('parseTextCommand service', () => {
  it('should assign BALANCE service if text command is empty', () => {
    const { service } = parseTextCommand('');
    expect(service).to.be('BALANCE');
  });

  it('should assign HELP service if text command is help', () => {
    const { service } = parseTextCommand('help');
    expect(service).to.be('HELP');
  });

  it('should assign TAIL service if text command is tail', () => {
    const { service } = parseTextCommand('tail');
    expect(service).to.be('TAIL');
  });

  it('should assign LIST_TRANSACTIONS service if text command mentions single username', () => {
    const text = `<@U12313|sincospi_u2>`;
    const { user, service } = parseTextCommand(text);
    expect(service).to.be('LIST_TRANSACTIONS');
    expect(user).to.be(text);
  });

  it('should assign CREATE_TRANSACTIONS service if user and amount are present', () => {
    const text = `<@U12313|sincospi_u2> 1`;
    const { service } = parseTextCommand(text);
    expect(service).to.be('CREATE_TRANSACTIONS');
  });

  it('should recognise amounts witn comma decimal point for CREATE_TRANSACTIONS', () => {
    const text = `<@U12313|sincospi_u2> 1,1`;
    const { service, userAmounts } = parseTextCommand(text);
    expect(service).to.be('CREATE_TRANSACTIONS');
    expect(userAmounts[0].amount).to.eql(1.1);
  });

  it('should recognise -ve amounts for CREATE_TRANSACTIONS', () => {
    const text = `<@U12313|sincospi_u2> -1`;
    const { service, userAmounts } = parseTextCommand(text);
    expect(service).to.be('CREATE_TRANSACTIONS');
    expect(userAmounts[0].amount).to.eql(-1);
  });

  it('should recognise +ve amounts with explicit + sign for CREATE_TRANSACTIONS', () => {
    const text = `<@U12313|sincospi_u2> +1`;
    const { service, userAmounts } = parseTextCommand(text);
    expect(service).to.be('CREATE_TRANSACTIONS');
    expect(userAmounts[0].amount).to.eql(1);
  });

  it('should parse user amount and description', () => {
    const text = `<@U12313|sincospi_u2> 1 bla bla`;
    const { userAmounts, description } = parseTextCommand(text);
    expect(description).to.be('bla bla');
    expect(userAmounts[0].user).to.be('<@U12313|sincospi_u2>');
    expect(userAmounts[0].amount).to.be(1);
  });

  it('should parse multiple user-amount pairs and description', () => {
    const text = `<@U12313|sincospi_u1> 1 <@U12313|sincospi_u2> 2 bla bla`;
    const { userAmounts, description } = parseTextCommand(text);
    expect(description).to.be('bla bla');
    expect(userAmounts[0].user).to.be('<@U12313|sincospi_u1>');
    expect(userAmounts[0].amount).to.be(1);
    expect(userAmounts[1].user).to.be('<@U12313|sincospi_u2>');
    expect(userAmounts[1].amount).to.be(2);
  });
});
