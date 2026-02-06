
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, CardType, Suit, PlayerType } from './types';
import { createDeck, isValidMove } from './utils';
import Card from './components/Card';
import SuitSelector from './components/SuitSelector';

const App: React.FC = () => {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [aiHand, setAiHand] = useState<CardType[]>([]);
  const [discardPile, setDiscardPile] = useState<CardType[]>([]);
  const [activeSuit, setActiveSuit] = useState<Suit | null>(null);
  const [message, setMessage] = useState<string>("欢迎来到 Tina疯狂8点！");
  const [turn, setTurn] = useState<PlayerType>('PLAYER');

  // 初始化游戏
  const startGame = useCallback(() => {
    const fullDeck = createDeck();
    const pHand = fullDeck.splice(0, 8);
    const aHand = fullDeck.splice(0, 8);
    
    // 寻找第一张非 8 的牌作为弃牌堆初始牌
    let firstCardIndex = 0;
    while(fullDeck[firstCardIndex].rank === '8') {
        firstCardIndex++;
    }
    const firstCard = fullDeck.splice(firstCardIndex, 1)[0];
    
    setDeck(fullDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstCard]);
    setActiveSuit(firstCard.suit);
    setGameState(GameState.PLAYER_TURN);
    setTurn('PLAYER');
    setMessage("轮到你了！出牌或摸牌。");
  }, []);

  // 弃牌堆顶部的牌
  const topCard = useMemo(() => discardPile[discardPile.length - 1], [discardPile]);

  // 处理玩家操作
  const playCard = (card: CardType) => {
    if (gameState !== GameState.PLAYER_TURN || !activeSuit) return;

    if (!isValidMove(card, topCard, activeSuit)) {
      setMessage("无效操作！花色或点数不匹配。");
      return;
    }

    // 处理出牌逻辑
    const newHand = playerHand.filter(c => c.id !== card.id);
    setPlayerHand(newHand);
    setDiscardPile(prev => [...prev, card]);
    setActiveSuit(card.suit);

    if (newHand.length === 0) {
      setGameState(GameState.GAME_OVER);
      setMessage("你赢了！🎉");
      return;
    }

    if (card.rank === '8') {
      setGameState(GameState.SELECTING_SUIT);
    } else {
      setTurn('AI');
      setGameState(GameState.AI_TURN);
      setMessage("AI 正在思考...");
    }
  };

  const drawCard = (player: PlayerType) => {
    if (deck.length === 0) {
      setMessage("牌堆已空！跳过摸牌。");
      if (player === 'PLAYER') {
        setTurn('AI');
        setGameState(GameState.AI_TURN);
      } else {
        setTurn('PLAYER');
        setGameState(GameState.PLAYER_TURN);
      }
      return;
    }

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);

    if (player === 'PLAYER') {
      setPlayerHand(prev => [...prev, card]);
      setMessage(`你摸到了 ${card.suit} ${card.rank}`);
      setTurn('AI');
      setGameState(GameState.AI_TURN);
    } else {
      setAiHand(prev => [...prev, card]);
      setMessage("AI 摸了一张牌。");
      setTurn('PLAYER');
      setGameState(GameState.PLAYER_TURN);
    }
  };

  // AI 逻辑
  useEffect(() => {
    if (gameState === GameState.AI_TURN && activeSuit) {
      const timer = setTimeout(() => {
        // 寻找非 8 的可出牌
        const normalPlayable = aiHand.filter(c => c.rank !== '8' && (c.suit === activeSuit || c.rank === topCard.rank));
        // 寻找 8
        const eights = aiHand.filter(c => c.rank === '8');

        if (normalPlayable.length > 0) {
          const cardToPlay = normalPlayable[Math.floor(Math.random() * normalPlayable.length)];
          setAiHand(prev => prev.filter(c => c.id !== cardToPlay.id));
          setDiscardPile(prev => [...prev, cardToPlay]);
          setActiveSuit(cardToPlay.suit);
          
          if (aiHand.length === 1) {
            setGameState(GameState.GAME_OVER);
            setMessage("AI 赢了！下次好运。");
          } else {
            setTurn('PLAYER');
            setGameState(GameState.PLAYER_TURN);
            setMessage("轮到你了！");
          }
        } else if (eights.length > 0) {
          const cardToPlay = eights[0];
          setAiHand(prev => prev.filter(c => c.id !== cardToPlay.id));
          setDiscardPile(prev => [...prev, cardToPlay]);
          
          // AI 选择拥有数量最多的花色
          const suitCounts: Record<string, number> = {};
          aiHand.forEach(c => {
            if (c.id !== cardToPlay.id) {
                suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
            }
          });
          const bestSuit = (Object.keys(suitCounts).sort((a,b) => suitCounts[b] - suitCounts[a])[0] as Suit) || Suit.HEARTS;
          setActiveSuit(bestSuit);
          
          const suitNames = { [Suit.HEARTS]: '红心', [Suit.DIAMONDS]: '方块', [Suit.CLUBS]: '梅花', [Suit.SPADES]: '黑桃' };
          setMessage(`AI 出了一个 8，并选择了 ${suitNames[bestSuit]}！`);

          if (aiHand.length === 1) {
            setGameState(GameState.GAME_OVER);
            setMessage("AI 获胜！");
          } else {
            setTurn('PLAYER');
            setGameState(GameState.PLAYER_TURN);
          }
        } else {
          drawCard('AI');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, aiHand, activeSuit, topCard]);

  const handleSuitSelect = (suit: Suit) => {
    setActiveSuit(suit);
    setGameState(GameState.AI_TURN);
    setTurn('AI');
    const suitNames = { [Suit.HEARTS]: '红心', [Suit.DIAMONDS]: '方块', [Suit.CLUBS]: '梅花', [Suit.SPADES]: '黑桃' };
    setMessage(`你选择了 ${suitNames[suit]}。AI 的回合...`);
  };

  return (
    <div className="h-screen w-full relative flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-b from-[#065f46] to-[#064e3b]">
      {/* HUD - 信息面板 */}
      <div className="w-full flex justify-between items-center px-4 max-w-5xl">
        {/* 对手面板 - AI */}
        <div className="flex flex-col items-center gap-1 bg-black/20 p-3 rounded-2xl border border-white/10 min-w-[80px] shadow-lg backdrop-blur-sm">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-inner">
            AI
          </div>
          <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mt-1">对手</p>
          <p className="text-white font-black text-xs">{aiHand.length} 张牌</p>
        </div>
        
        {/* 中央提示信息 */}
        <div className="bg-black/40 px-6 py-2 rounded-full border border-white/10 shadow-xl max-w-[40%] text-center">
          <p className="text-yellow-400 font-black text-sm md:text-base tracking-wider uppercase title-font truncate">
            {message}
          </p>
        </div>

        {/* 玩家面板 - 我 */}
        <div className="flex flex-col items-center gap-1 bg-black/20 p-3 rounded-2xl border border-white/10 min-w-[80px] shadow-lg backdrop-blur-sm">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-inner">
            我
          </div>
          <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mt-1">玩家</p>
          <p className="text-white font-black text-xs">{playerHand.length} 张牌</p>
        </div>
      </div>

      {/* 桌面主要区域 */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative max-w-5xl">
        
        {/* AI 手牌 (仅视觉展示) */}
        <div className="absolute top-0 flex -space-x-8 md:-space-x-12 opacity-80 scale-75 md:scale-100 origin-top">
          {aiHand.map((_, i) => (
            <div key={i} className="transform scale-75 md:scale-90">
                <Card card={{} as any} hidden size="sm" />
            </div>
          ))}
        </div>

        {/* 中心牌堆 */}
        {gameState !== GameState.LOBBY && (
          <div className="flex gap-8 md:gap-24 items-center">
            {/*摸牌堆*/}
            <div className="flex flex-col items-center gap-2">
              <div 
                className={`relative group ${gameState === GameState.PLAYER_TURN ? 'cursor-pointer' : 'opacity-50 pointer-events-none'}`}
                onClick={() => drawCard('PLAYER')}
              >
                <div className="absolute -inset-1 bg-yellow-400/20 rounded-lg blur group-hover:bg-yellow-400/40 transition-all"></div>
                <Card card={{} as any} hidden size="md" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-2xl drop-shadow-md">{deck.length}</span>
                </div>
              </div>
              <span className="text-white/50 text-xs font-bold uppercase tracking-tighter">摸牌堆</span>
            </div>

            {/*弃牌堆*/}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {/* 视觉堆叠效果 */}
                {discardPile.length > 1 && (
                    <div className="absolute top-1 left-1 transform rotate-3">
                        <Card card={discardPile[discardPile.length - 2]} size="md" disabled />
                    </div>
                )}
                <div className="relative z-10 transition-transform animate-in slide-in-from-top-4 duration-500">
                  <Card card={topCard} size="md" disabled />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded border border-white/5">
                 <span className="text-white/50 text-[10px] font-bold uppercase">当前花色:</span>
                 <span className={`text-sm font-black ${activeSuit === Suit.HEARTS || activeSuit === Suit.DIAMONDS ? 'text-red-500' : 'text-slate-900'} bg-white/90 px-1.5 rounded-sm`}>
                   {activeSuit}
                 </span>
              </div>
            </div>
          </div>
        )}

        {/* 游戏大厅界面 */}
        {gameState === GameState.LOBBY && (
          <div className="text-center space-y-8 p-12 bg-black/30 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl animate-in fade-in zoom-in">
            <h1 className="flex flex-col items-center drop-shadow-2xl title-font leading-none">
              <span className="text-5xl md:text-7xl font-black text-white">Tina</span>
              <span className="text-4xl md:text-6xl font-black text-yellow-400 mt-2">疯狂8点</span>
            </h1>
            <div className="text-white/70 max-w-md mx-auto text-lg leading-relaxed">
              <p>匹配数字或者花色即可出牌，8是万用牌</p>
              <p className="mt-2 font-black text-white text-xl">先出完所有牌的人获胜</p>
            </div>
            <button 
              onClick={startGame}
              className="px-12 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl rounded-full shadow-[0_0_40px_rgba(250,204,21,0.3)] transition-all transform hover:scale-110 active:scale-95 uppercase tracking-widest"
            >
              开始游戏
            </button>
          </div>
        )}

        {/* 游戏结束界面 */}
        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
             <h2 className="text-6xl font-black text-white mb-8 title-font text-center px-4">{message}</h2>
             <button 
              onClick={() => setGameState(GameState.LOBBY)}
              className="px-12 py-4 bg-white text-black font-black text-xl rounded-full hover:bg-gray-200 transition-all transform hover:scale-110"
            >
              再玩一次
            </button>
          </div>
        )}
      </div>

      {/* 玩家手牌 */}
      {gameState !== GameState.LOBBY && gameState !== GameState.GAME_OVER && (
        <div className="w-full max-w-6xl pb-4 overflow-visible">
          <div className="flex flex-wrap justify-center -space-x-8 md:-space-x-12 overflow-visible px-4">
            {playerHand.map((card) => (
              <div 
                key={card.id} 
                className={`transition-all duration-300 hover:z-50 hover:scale-110 ${gameState !== GameState.PLAYER_TURN ? 'opacity-70 grayscale-[0.2]' : ''}`}
              >
                <Card 
                  card={card} 
                  size="md"
                  onClick={() => playCard(card)}
                  disabled={gameState !== GameState.PLAYER_TURN}
                  playable={gameState === GameState.PLAYER_TURN && activeSuit ? isValidMove(card, topCard, activeSuit) : false}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 花色选择遮罩层 */}
      {gameState === GameState.SELECTING_SUIT && (
        <SuitSelector onSelect={handleSuitSelect} />
      )}

      {/* 移动端提示 */}
      <div className="md:hidden text-white/40 text-[10px] uppercase font-bold text-center mt-2 pb-2">
        如果手牌较多，可以水平滚动查看
      </div>
    </div>
  );
};

export default App;
