        let score = 0;
        let hintsUsed = 0;
        let missionsCompleted = 0;
        
        function showHint(missionNumber) {
            const hintBox = document.getElementById(`hint${missionNumber}`);
            hintBox.style.display = 'block';
            hintsUsed++;
            score -= 5;
            updateScore();
        }
        
        function updateScore() {
            document.getElementById('score').textContent = score;
            document.getElementById('hints-used').textContent = hintsUsed;
            const progress = (missionsCompleted / 3) * 100;
            document.getElementById('progress').style.width = progress + '%';
            document.getElementById('progress-text').textContent = Math.round(progress) + '%';
        }
        
        function checkMission1() {
            const reductionRate = parseFloat(document.getElementById('reduction-rate').value);
            const method = document.getElementById('calculation-method').value;
            
            if (!reductionRate || !method) {
                alert('Por favor, preencha ambos os campos!');
                return;
            }
            
            // Taxa correta é aproximadamente 5-6% (variação entre os meses)
            if (reductionRate >= 4.5 && reductionRate <= 7) {
                score += 30;
                missionsCompleted = Math.max(missionsCompleted, 1);
                alert('✅ Excelente! Você identificou corretamente a taxa de redução.');
            } else if (reductionRate >= 3 && reductionRate <= 9) {
                score += 20;
                missionsCompleted = Math.max(missionsCompleted, 1);
                alert('⚠️ Próximo da resposta! A taxa está um pouco fora do esperado.');
            } else {
                score += 10;
                alert('❌ A taxa parece estar incorreta. Revise os cálculos.');
            }
            
            updateScore();
        }
        
        function checkMission2() {
            const sept = parseInt(document.getElementById('september-estimate').value);
            const nov = parseInt(document.getElementById('november-estimate').value);
            
            if (!sept || !nov) {
                alert('Por favor, preencha ambas as estimativas!');
                return;
            }
            
            // Setembro (~7500) e Novembro (~6500) considerando redução de ~5.5%
            let septScore = 0;
            let novScore = 0;
            
            if (sept >= 7200 && sept <= 7800) septScore = 20;
            else if (sept >= 6800 && sept <= 8200) septScore = 15;
            else septScore = 5;
            
            if (nov >= 6200 && nov <= 6800) novScore = 20;
            else if (nov >= 5800 && nov <= 7200) novScore = 15;
            else novScore = 5;
            
            const totalMission2 = septScore + novScore;
            score += totalMission2;
            missionsCompleted = Math.max(missionsCompleted, 2);
            
            if (totalMission2 >= 35) {
                alert('🎯 Predições excelentes! Você domina as estimativas indutivas.');
            } else if (totalMission2 >= 25) {
                alert('👍 Boas estimativas! Algumas pequenas correções melhorariam a precisão.');
            } else {
                alert('🤔 As estimativas precisam ser revisadas. Considere o padrão identificado na Missão 1.');
            }
            
            updateScore();
        }
        
        function checkMission3() {
            const diagnosis = document.getElementById('diagnosis').value;
            const recommendation = document.getElementById('recommendation').value;
            
            if (!diagnosis || !recommendation) {
                alert('Por favor, preencha ambos os campos!');
                return;
            }
            
            if (diagnosis === 'maintenance') {
                score += 30;
                alert('🕵️ Diagnóstico perfeito! A falta de manutenção explica a redução constante.');
            } else {
                score += 10;
                alert('🤔 Diagnóstico parcial. Revise as evidências sobre acúmulo de sujeira.');
            }
            
            missionsCompleted = 3;
            updateScore();
        }
        
        function submitCase() {
            if (missionsCompleted < 3) {
                alert('Complete todas as missões antes de finalizar a investigação!');
                return;
            }
            
            let badge = '';
            let evaluation = '';
            
            if (score >= 80) {
                badge = '🏆 SHERLOCK HOLMES ESTATÍSTICO';
                evaluation = 'Investigação excepcional! Você dominou completamente o uso de estimativas indutivas.';
            } else if (score >= 60) {
                badge = '🥈 DETETIVE EXPERIENTE';
                evaluation = 'Ótimo trabalho! Suas habilidades de estimativa estão bem desenvolvidas.';
            } else if (score >= 40) {
                badge = '🥉 INVESTIGADOR COMPETENTE';
                evaluation = 'Bom progresso! Continue praticando para aperfeiçoar suas estimativas.';
            } else {
                badge = '📝 DETETIVE EM TREINAMENTO';
                evaluation = 'Continue estudando! O importante é aprender com os erros.';
            }
            
            document.getElementById('result-title').textContent = badge;
            document.getElementById('result-content').innerHTML = `
                <p>${evaluation}</p>
                <h3>📋 Solução do Caso:</h3>
                <p>A redução na produção da fazenda solar era causada pelo <strong>acúmulo progressivo de sujeira</strong> nos painéis, resultando em uma perda de eficiência de aproximadamente 5,5% ao mês.</p>
                <p>Isso é um padrão comum em instalações solares sem manutenção preventiva regular.</p>
            `;
            document.getElementById('final-score').innerHTML = `
                <h3>Pontuação Final: ${score} pontos</h3>
                <p>Dicas utilizadas: ${hintsUsed}</p>
            `;
            
            document.getElementById('resultModal').style.display = 'block';
        }
        
        function closeModal() {
            document.getElementById('resultModal').style.display = 'none';
        }
        
        // Initialize
        updateScore()
    