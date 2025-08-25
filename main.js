// Game state variables
        let gameState = {
            score: 0,
            hintsUsed: 0,
            missionsCompleted: 0,
            startTime: Date.now(),
            mission1Data: null,
            mission2Data: null,
            mission3Data: null
        };
        
        let gameTimer;
        
        // Initialize game
        function initGame() {
            updateDisplay();
            startTimer();
        }
        
        function startTimer() {
            gameTimer = setInterval(() => {
                const elapsed = Date.now() - gameState.startTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                document.getElementById('elapsed-time').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                document.getElementById('timer').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }
        
        function highlightEvidence(card) {
            // Remove previous highlights
            document.querySelectorAll('.evidence-card').forEach(c => {
                c.style.borderLeft = '5px solid #FFD700';
            });
            
            // Highlight selected card
            card.style.borderLeft = '5px solid #00ff88';
            card.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
            
            // Add temporary glow effect
            setTimeout(() => {
                card.style.borderLeft = '5px solid #FFD700';
                card.style.boxShadow = '';
            }, 2000);
        }
        
        function showHint(missionNumber) {
            const hintBox = document.getElementById(`hint${missionNumber}`);
            if (hintBox.style.display === 'none' || !hintBox.style.display) {
                hintBox.style.display = 'block';
                gameState.hintsUsed++;
                gameState.score = Math.max(0, gameState.score - 5);
                updateDisplay();
                
                // Disable hint button
                event.target.disabled = true;
                event.target.textContent = '💡 Dica Usada';
            }
        }
        
        function checkMission1() {
            const reductionRate = parseFloat(document.getElementById('reduction-rate').value);
            const method = document.getElementById('calculation-method').value.trim();
            
            if (isNaN(reductionRate) || !method) {
                showFeedback('feedback1', 'Por favor, preencha ambos os campos!', 'incorrect');
                return;
            }
            
            let score = 0;
            let feedback = '';
            
            if (reductionRate >= 5.0 && reductionRate <= 5.5) {
                score = 30;
                feedback = '🎯 Perfeito! Taxa correta (~5,2% por mês). Excelente análise dos dados!';
                showFeedback('feedback1', feedback, 'correct');
            } else if (reductionRate >= 4.5 && reductionRate <= 6.0) {
                score = 25;
                feedback = '👍 Muito bom! Você está próximo do valor correto (~5,2%).';
                showFeedback('feedback1', feedback, 'partial');
            } else if (reductionRate >= 3.0 && reductionRate <= 7.0) {
                score = 15;
                feedback = '⚠️ Parcialmente correto. Revise seus cálculos - a taxa correta é ~5,2%.';
                showFeedback('feedback1', feedback, 'partial');
            } else {
                score = 5;
                feedback = '❌ Taxa incorreta. Use os dados: Jan(12.500)→Mar(11.200) = 10,4% em 2 meses.';
                showFeedback('feedback1', feedback, 'incorrect');
            }
            
            gameState.score += score;
            gameState.mission1Data = { rate: reductionRate, method: method, score: score };
            
            if (score >= 20) {
                completeMission(1);
                unlockMission(2);
            }
            
            updateDisplay();
        }
        
        function checkMission2() {
            const septEst = parseInt(document.getElementById('september-estimate').value);
            const novEst = parseInt(document.getElementById('november-estimate').value);
            
            if (isNaN(septEst) || isNaN(novEst)) {
                showFeedback('feedback2a', 'Preencha ambas as estimativas!', 'incorrect');
                return;
            }
            
            const rate = gameState.mission1Data.rate / 100;
            const julyProduction = 8600;
            
            // Cálculos corretos (aproximados)
            const correctSept = julyProduction * Math.pow(1 - rate, 2); // 2 meses após julho
            const correctNov = julyProduction * Math.pow(1 - rate, 4); // 4 meses após julho
            
            let septScore = 0;
            let novScore = 0;
            
            // Avaliação Setembro
            const septError = Math.abs(septEst - correctSept) / correctSept;
            if (septError <= 0.05) septScore = 20;
            else if (septError <= 0.10) septScore = 17;
            else if (septError <= 0.15) septScore = 13;
            else if (septError <= 0.25) septScore = 8;
            else septScore = 3;
            
            // Avaliação Novembro
            const novError = Math.abs(novEst - correctNov) / correctNov;
            if (novError <= 0.05) novScore = 20;
            else if (novError <= 0.10) novScore = 17;
            else if (novError <= 0.15) novScore = 13;
            else if (novError <= 0.25) novScore = 8;
            else novScore = 3;
            
            const totalScore = septScore + novScore;
            gameState.score +=